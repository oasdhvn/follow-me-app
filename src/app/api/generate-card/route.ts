import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface GuideCard {
  title: string
  location: string
  duration: string
  budget: string
  highlights: string[]
  tips: string[]
  bestTime: string
  tags: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { keywords, style } = await request.json()
    
    if (!keywords || keywords.trim() === '') {
      return NextResponse.json(
        { error: '请输入关键词' },
        { status: 400 }
      )
    }

    // ZAI SDK 自动从环境变量 ZAI_API_KEY 读取 API Key
    // 无需手动传入参数

    const zai = await ZAI.create()
    
    const prompt = `你是一个专业的旅行攻略助手。用户会输入旅行相关的关键词，你需要生成一份结构化的旅行攻略卡片信息。

关键词：${keywords}

请以JSON格式返回以下信息（不要包含markdown代码块标记）：
{
  "title": "攻略标题（简洁有吸引力）",
  "location": "目的地位置",
  "duration": "建议游玩时长",
  "budget": "预算范围",
  "highlights": ["必打卡景点1", "必打卡景点2", "必打卡景点3", "必打卡景点4"],
  "tips": ["实用贴士1", "实用贴士2", "实用贴士3"],
  "bestTime": "最佳旅行时间",
  "tags": ["标签1", "标签2", "标签3"]
}

要求：
1. 内容要具体实用，避免泛泛而谈
2. 标题要有吸引力，能让人产生旅行冲动
3. 景点推荐要真实可信
4. 贴士要实用，包含交通、住宿、美食等建议
5. 标签要精准，便于分类搜索

只返回JSON，不要其他解释。`

    const completion = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的旅行攻略助手，擅长生成结构化、实用的旅行信息。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0]?.message?.content || ''
    
    // 解析JSON
    let cardData: GuideCard
    try {
      // 清理可能的markdown代码块标记
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
      cardData = JSON.parse(cleanContent)
    } catch {
      // 如果解析失败，返回默认结构
      cardData = {
        title: `${keywords}旅行攻略`,
        location: keywords,
        duration: '2-3天',
        budget: '人均1000-3000元',
        highlights: ['景点1', '景点2', '景点3', '景点4'],
        tips: ['建议提前预订住宿', '注意当地天气', '尊重当地文化'],
        bestTime: '春秋季节',
        tags: [keywords, '旅行', '攻略']
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: cardData 
    })
    
  } catch (error) {
    console.error('Generate card error:', error)
    return NextResponse.json(
      { error: '生成失败，请稍后重试' },
      { status: 500 }
    )
  }
}
