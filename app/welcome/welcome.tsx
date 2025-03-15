import React, { useState } from 'react';
// import { useNavigate } from "react-router";
import { Link } from "react-router";
import logoDark from './if.svg';
import logoLight from './if.svg';
import { jobs } from '../data/jobs'; // 导入jobs数据

function timeAgo(date) {
  const now = new Date();
  const diff = (now - date) / 1000; // 秒差
  if (diff < 60) return `${Math.floor(diff)} 分钟前`;
  if (diff < 3600) return `${Math.floor(diff / 60)} 小时前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 天前`;
  return `${Math.floor(diff / 86400)} 天前`;
}

export function Welcome() {
  const [selected, setSelected] = useState('home'); // 默认选中首页
  const [selectedCategory, setSelectedCategory] = useState('all'); // 默认选中全部标签

  // 过滤显示不同的职位数据
  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory === 'all') return true;
    return job.tags.includes(selectedCategory); // 根据选中的标签筛选职位
  });

  // 状态控制弹窗显示/隐藏
  const [isModalOpen, setIsModalOpen] = useState(true); // 默认打开

  return (
    <>
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 p-1 flex items-center justify-between z-10">
          {/* 左侧Logo (仅PC端显示) */}
          <div className="w-[100px] sm:w-[120px] hidden sm:block">
            <img
              src={logoLight}
              alt="ideafly logo"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="ideafly logo"
              className="hidden w-full dark:block"
            />
          </div>

          {/* 移动端分组标签 (仅移动端显示) */}
          <div className="sm:hidden flex-grow text-center flex items-center justify-center">
            {/* 三条横线图标 */}
            <svg
              className="w-6 h-6 text-gray-900 dark:text-gray-200 mr-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            {/* 文字按钮 */}
            <span
              className={`mx-3 text-gray-900 dark:text-gray-200 text-lg ${selectedCategory === 'all' ? 'text-black border-b-2 border-gray-900' : 'text-gray-300'}`}
              onClick={() => setSelectedCategory('all')}
            >
              兼职
            </span>
            <span
              className={`mx-3 text-gray-900 dark:text-gray-200 text-lg ${selectedCategory === '区块链' ? 'text-black border-b-2 border-gray-900' : 'text-gray-300'}`}
              onClick={() => setSelectedCategory('区块链')}
            >
              外包
            </span>
            <span
              className={`mx-3 text-gray-900 dark:text-gray-200 text-lg ${selectedCategory === 'AI' ? 'text-black border-b-2 border-gray-500' : 'text-gray-300'}`}
              onClick={() => setSelectedCategory('AI')}
            >
              众筹创业
            </span>

            {/* 移动端搜索图标 */}
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 ml-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 11m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0zm10 10l-4.35-4.35"
                />
              </svg>
            </button>
          </div>

          {/* 中间搜索框 (PC端) */}
          <div className="hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search for jobs..."
              className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 sm:w-[300px] lg:w-[400px]"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
              搜索
            </button>
          </div>        

          {/* 右上角按钮 (PC端头像按钮) */}
          <div className="flex items-center space-x-4">
            <button
              className="hidden sm:block p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              style={{ marginRight: '16px' }}
              onClick={() => {
                window.location.href = '/profile';
              }}
            >
              <img
                src="/favicon.svg"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </button>
          </div>
        </header>

        {/* 弹窗 */}
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-screen h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg relative"
              style={{ maxWidth: '330px', width: '100%' }}
            >
              <img
                src="/favicon.svg"
                alt="Logo"
                className="bg-white absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white"
              />
              <button
                className="absolute top-0 right-0 text-black hover:text-gray-300 w-10 h-10 flex items-center justify-center text-3xl rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>

              {/* 始终显示下载按钮，点击时根据环境判断 */}
              <div>
                <p className="mb-4 text-2xl font-semibold text-center text-black">
                  下载 ideaFly app
                </p>
                <p className="mb-4 text-base text-center text-black">
                  获得完整的应用体验
                </p>
                <div className="flex justify-center space-x-6">
                <a
                    href={
                      ((): string => {
                        const isBrowser = typeof navigator !== 'undefined';
                        // const isWeChat = isBrowser && /MicroMessenger/i.test(navigator.userAgent);
                        return isBrowser ? '/app-release.apk' : '/weChatRedire';
                      })()
                    }
                    download={
                      typeof navigator !== 'undefined' && !/MicroMessenger/i.test(navigator.userAgent)
                    }
                    className="bg-red-500 text-white font-bold w-24 h-12 flex items-center justify-center rounded-lg shadow-md hover:bg-red-600"
                  >
                    Android
                  </a>
                  <a
                    href={(() => {
                      const isBrowser = typeof navigator !== 'undefined';
                      const isWeChat = isBrowser ? /MicroMessenger/i.test(navigator.userAgent) : false;
                      return isWeChat
                        ? '/weChatRedire' // 微信中跳转到新页面
                        : '/app-release.apk'; // 非微信直接下载 (假设 iOS 使用 .ipa 文件)
                    })()}
                    download={!/MicroMessenger/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')}
                    className="bg-red-500 text-white font-bold w-24 h-12 flex items-center justify-center rounded-lg shadow-md hover:bg-red-600"
                  >
                    iOS
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="pt-0 sm:pt-20 pb-20">
          <div className="max-w-full lg:max-w-4xl mx-auto px-4">
            <div 
              className="h-screen snap-y snap-mandatory overflow-y-scroll"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {jobs.map(
                (
                  { 
                    title, 
                    projectDescription, 
                    salaryRange, 
                    jobRequirements, 
                    workMode, 
                    duration, 
                    tags, 
                    location, 
                    spent, 
                    postedTime 
                  },
                  index
                ) => (
                  <div
                    key={index}
                    className="h-screen snap-start flex items-center justify-center relative bg-white dark:bg-gray-800"
                  >
                    <div className="w-full p-6 relative">
                      {/* 职位内容 */}
                      <div className="w-full">
                        {/* 发布信息 */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {timeAgo(postedTime)} 发布
                        </p>
                        {/* 标题 */}
                        <h2 
                          className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200" 
                          style={{ marginBottom: '16px' }}
                        >
                          {title}
                        </h2>
                        {/* 项目介绍 */}
                        <div className="mb-4">
                          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">项目介绍</h3>
                          <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                            {projectDescription}
                          </p>
                        </div>
                        {/* 薪资范围 */}
                        <div className="mb-4">
                          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">薪资范围</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {salaryRange.perHour}，总预算 {salaryRange.totalBudget}
                          </p>
                        </div>
                        {/* 职位要求 */}
                        <div className="mb-4">
                          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">职位要求</h3>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm">
                            {jobRequirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        {/* 工作方式 */}
                        <div className="mb-4">
                          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">工作方式</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {workMode}
                          </p>
                        </div>
                        {/* 其他信息 */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          预计持续时间：{duration}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          位置：{location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          已花费：{spent}
                        </p>
                        {/* 标签 */}
                        <div className="mt-2 flex flex-wrap space-x-2">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 右侧交互按钮 - 覆盖在内容上 */}
                      <div className="absolute right-0 bottom-6 flex flex-col items-center space-y-6">
                        {/* 头像和关注按钮 */}
                        <div className="flex flex-col items-center relative">
                          <img
                            src="/favicon.svg" // 替换为实际的头像URL或路径
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full border-2 border-gray-500"
                          />
                          <button className="absolute top-9 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                        {/* 点赞 */}
                        <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                          <span className="text-sm">123</span>
                        </button>
                        {/* 评论 */}
                        <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg>
                          <span className="text-sm">45</span>
                        </button>
                        {/* 收藏 */}
                        <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path>
                          </svg>
                          <span className="text-sm">67</span>
                        </button>
                        {/* 转发 */}
                        <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-12 5H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                          <span className="text-sm">28</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </main>

      {/* 移动端底部按钮 */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 flex justify-around sm:hidden shadow-lg" style={{ height: '55px' }}>
        <button
          className={`flex flex-col items-center text-[1.2rem] mb-2 ${selected === 'home' ? 'text-gray-900' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('home')}
        >
          首页
        </button>
        <button
          className={`flex flex-col items-center text-[1.2rem] mb-2 ${selected === 'me' ? 'text-gray-900' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('me')}
        >
          商城
        </button>
        <Link
          to="/login"  // 使用 Link 实现跳转
          className="p-2 rounded-full text-white flex items-center justify-center"
        >
          <img
            src="./plus.svg"
            alt="Plus Icon"
            className="w-9 h-9"
          />
        </Link>
        <button
          className={`flex flex-col items-center text-[1.2rem] mb-2 ${selected === 'messages' ? 'text-gray-900' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('messages')}
        >
          消息
        </button>
        <button
          className={`flex flex-col items-center text-[1.2rem] mb-2 ${selected === 'me' ? 'text-gray-900' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('me')}
        >
          我
        </button>
      </nav>
    </>
  );
}