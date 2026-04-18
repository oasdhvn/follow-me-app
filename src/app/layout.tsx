import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Follow Me - 旅行攻略分享',
  description: 'AI驱动的旅行社交平台，一键生成精美攻略卡片',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // 移除 Next.js 左下角英文角标并替换为中文版
                function removeNextBadge(){
                  var removed = false;
                  // 方式1: button with aria-label
                  var btns = document.querySelectorAll('button');
                  btns.forEach(function(b){
                    if(b.getAttribute('aria-label') && b.getAttribute('aria-label').indexOf('Next') !== -1){
                      b.style.display='none'; removed=true;
                    }
                  });
                  // 方式2: fixed svg container
                  document.querySelectorAll('body>div').forEach(function(d){
                    var s=getComputedStyle(d);
                    if((s.position==='fixed'||d.style.position==='fixed')&&d.querySelector('svg')){
                      d.style.display='none'; removed=true;
                    }
                  });
                  // 方式3: nextjs.org links
                  document.querySelectorAll('a[href*="nextjs.org"]').forEach(function(a){
                    var p=a.closest('div[style*="fixed"],button');
                    if(p){p.style.display='none'; removed=true;}
                    else{a.parentElement.style.display='none'; removed=true;}
                  });
                  return removed;
                }
                var iv=setInterval(function(){
                  if(removeNextBadge()) clearInterval(iv);
                },600);
                // 额外保险：多次尝试
                setTimeout(function(){removeNextBadge();},3000);
                setTimeout(function(){removeNextBadge();},8000);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <AuthProvider>
          <Header />
          {children}
          {/* 中文角标 - 替换 Next.js 英文角标 */}
          <div
            className="fixed bottom-3 left-3 z-[9999] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-gray-500 font-medium select-none"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <span className="text-base">🧭</span>
            <span className="text-sky-500 font-semibold">Next.js</span>
            <span>驱动 · AI旅行社交</span>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
