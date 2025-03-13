import React, { useState } from 'react';
// import { useNavigate } from "react-router";
import { Link } from "react-router";
import logoDark from './ideafly.svg';
import logoLight from './ideafly.svg';
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

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 p-1 flex items-center justify-between">
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
            style={{ marginRight: '16px' }}  // 设置右边距为16px
            onClick={() => {
              // 跳转到个人页面
              window.location.href = '/profile';
            }}
          >
            <img
              src="/favicon.ico"  // 修改为public目录下的ico文件路径
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </header>
      {/* 主内容区域 */}
      <div className="bg-blue-500 text-white p-8 text-center">
        <p className="mb-4 text-xl font-semibold">下载我们的App</p>
        <div className="flex justify-center space-x-6">
          <a href="/app-release.apk" download className="bg-white text-blue-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100">安卓</a>
          <a href="/path/to/ios-app.apk" download className="bg-white text-blue-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100">iOS</a>
        </div>
      </div>
      <main className="pt-4 sm:pt-20 pb-20">
        <div className="max-w-full lg:max-w-4xl mx-auto space-y-4 px-4">
          <ul className="space-y-4">
            {filteredJobs.map(
              (
                { title, description, salaryPerHour, budget, duration, tags, location, spent, postedTime },
                index
              ) => (
                <li
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg"
                >
                  {/* 发布信息 */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {timeAgo(postedTime)} 发布
                  </p>
                  {/* 标题 */}
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200" style={{ marginBottom: '16px' }}>
                    {title}
                  </h2>
                  {/* 预算和时间 */}
                  <p className="text-sm text-gray-500 dark:text-gray-400" style={{ marginBottom: '16px' }}>
                    {salaryPerHour}，预算 {budget}，预计持续时间 {duration}
                  </p>
                  {/* 描述 */}
                  <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                    <p
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {description}
                    </p>

                    {description.length > 100 && (
                      <a
                        href="#"
                        className="hover:no-underline"
                        style={{
                          color: 'green',
                          textDecoration: 'underline',
                          textDecorationColor: 'green',
                          fontSize: '18px',
                          lineHeight: '1.5',
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('显示完整内容逻辑未实现');
                        }}
                      >
                        更多的
                      </a>
                    )}
                  </div>
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
                  {/* 花费和位置 */}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    已花费：{spent}，位置：{location}
                  </p>
                </li>
              )
            )}
          </ul>
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
