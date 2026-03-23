import React from 'react';
import { ArrowRight } from 'lucide-react';

export const MobileMockup = ({ profile = {}, links = [] }) => {
  return (
    <div className="relative w-[300px] h-[600px] rounded-[50px] border-[12px] border-[#131118] bg-white shadow-2xl overflow-hidden flex flex-col items-center p-6 pb-12 ring-[1px] ring-slate-200 mx-auto">
      {/* Notch */}
      <div className="absolute top-0 w-[45%] h-[24px] bg-[#131118] rounded-b-3xl z-10 flex justify-center items-end pb-1">
         <div className="w-12 h-1.5 bg-slate-800 rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center mt-12 gap-8 overflow-y-auto no-scrollbar pb-6">
        
        {/* Profile Details Area */}
        <div className="flex flex-col items-center gap-4 w-full">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-[104px] h-[104px] rounded-full object-cover border-4 border-primary-600 shadow-xl" />
          ) : (
             <div className="w-[104px] h-[104px] rounded-full bg-slate-100 border-4 border-slate-50 shadow-inner flex items-center justify-center text-slate-300">
               {/* Empty Placeholder */}
             </div>
          )}
          
          <div className="flex flex-col items-center gap-2 w-full px-2 text-center">
            {profile.firstName || profile.lastName ? (
              <h2 className="text-xl font-bold text-slate-900 truncate w-full">{profile.firstName} {profile.lastName}</h2>
            ) : (
              <div className="h-4 bg-slate-200 rounded-full w-[160px] animate-pulse"></div>
            )}
            
            {profile.email ? (
              <p className="text-sm text-slate-500 truncate w-full">{profile.email}</p>
            ) : (
              <div className="h-2 bg-slate-200 rounded-full w-[72px] mt-1 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Links Area */}
        <div className="w-full flex flex-col gap-4">
          {links.length > 0 ? (
            links.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full h-[56px] rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-sm transition-transform hover:scale-[1.02] bg-slate-800"
                style={{ backgroundColor: getPlatformColor(link.platform), color: getPlatformTextColor(link.platform) }}
              >
                <div className="flex items-center gap-2">
                  <span>{link.platform}</span>
                </div>
                <ArrowRight size={16} />
              </a>
            ))
          ) : (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-[48px] rounded-xl bg-slate-100 animate-pulse"></div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function getPlatformColor(platform) {
  const colors = {
    GitHub: '#1A1A1A',
    YouTube: '#EE3939',
    LinkedIn: '#2D68FF',
    Facebook: '#2442AC',
    Twitter: '#43B7E9',
    FrontendMentor: '#FFFFFF',
    Twitch: '#9146FF',
    'Dev.to': '#333333',
    Codewars: '#AD2C27',
    Codepen: '#1E1F26',
    freeCodeCamp: '#302267',
    GitLab: '#EB4925',
    Hashnode: '#2962FF',
    'Stack Overflow': '#EC7100',
  };
  return colors[platform] || '#6d28d9';
}

function getPlatformTextColor(platform) {
  if (platform === 'FrontendMentor') return '#333333';
  return '#FFFFFF';
}
