import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router";
import logoDark from './if.svg';
import logoLight from './if.svg';
import { jobs } from '../data/jobs'; 

export function Welcome() {
  const [selected, setSelected] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [androidDownload, setAndroidDownload] = useState(false);
  const [androidHref, setAndroidHref] = useState('/app-release.apk');
  const [iosDownload, setIosDownload] = useState(false);
  const [iosHref, setIosHref] = useState('/app-release.apk');
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(null);
  const [newComment, setNewComment] = useState('');
  
  const scrollRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    setAndroidDownload(!isWeChat);
    setAndroidHref('/app-release.apk');
    setIosDownload(!isWeChat);
    setIosHref(isWeChat ? '/weChatRedire' : '/app-release.apk');
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (selectedCategory === 'all') return true;
    return job.tags.includes(selectedCategory);
  });

  const [isModalOpen, setIsModalOpen] = useState(true);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
    }
  };

  const openComments = (index) => {
    setCurrentJobIndex(index);
    setIsCommentOpen(true);
  };

  const closeComments = () => {
    setIsCommentOpen(false);
    setCurrentJobIndex(null);
    setNewComment('');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && currentJobIndex !== null) {
      // 这里可以添加实际的评论提交逻辑
      console.log(`New comment for job ${currentJobIndex}: ${newComment}`);
      setNewComment('');
    }
  };

  return (
    <>
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
            <div>
              <p className="mb-4 text-2xl font-semibold text-center text-black">
                下载 ideaFly app
              </p>
              <p className="mb-4 text-base text-center text-black">
                获得完整的应用体验
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href={androidHref}
                  download={androidDownload}
                  className="bg-red-500 text-white font-bold w-24 h-12 flex items-center justify-center rounded-lg shadow-md hover:bg-red-600"
                >
                  Android
                </a>
                <a
                  href={iosHref}
                  download={iosDownload}
                  className="bg-red-500 text-white font-bold w-24 h-12 flex items-center justify-center rounded-lg shadow-md hover:bg-red-600"
                >
                  iOS
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCommentOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeComments();
          }}
        >
          <div 
            ref={commentRef}
            className="bg-white w-full h-[60vh] rounded-t-2xl flex flex-col animate-slide-up"
            style={{ maxHeight: '60vh' }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-semibold">
                {currentJobIndex !== null ? `${jobs[currentJobIndex].comments || 0} 条评论` : '评论'}
              </span>
              <button onClick={closeComments} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-gray-500 text-center py-4">
                暂无评论，快来发表第一条评论吧！
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="p-4 border-t flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="添加评论..."
                className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`p-2 rounded-full ${newComment.trim() ? 'text-blue-500' : 'text-gray-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 w-full bg-gray-100 py-1 z-20">
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

        <div className="sm:hidden flex items-center justify-between w-full px-0.5">
          <svg
            className="w-6 h-6 text-gray-900 dark:text-gray-200 ml-2"
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
          <button className="rounded-full bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 mr-2">
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

        <div className="hidden sm:flex items-center">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200 sm:w-[300px] lg:w-[400px]"
          />
          <button className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
            搜索
          </button>
        </div>

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

      <main
        ref={scrollRef}
        className="bg-white snap-x snap-mandatory overflow-x-auto scrollbar-hide pt-10"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          scrollSnapStop: 'always',
          height: 'calc(100vh - 0rem)', 
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
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
              postedTime,
              likes,
              comments,
              favorites,
              shares,
            },
            index
          ) => (
            <div
              key={index}
              className="relative w-screen flex-shrink-0 snap-start"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                height: 'calc(100vh - 3rem)',
              }}
            >
              <div className="w-full h-full relative">
                <div
                  className="w-full px-3 py-1 overflow-y-auto absolute top-0 left-0"
                  style={{ 
                    height: 'calc(100vh - 3rem)',
                    paddingBottom: '20px'
                  }}
                >
                  <p className="text-sm text-white-500 dark:text-white mb-2">
                    {`${postedTime} 分钟前`} 发布
                  </p>
                  <h2 
                    className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200" 
                    style={{ marginBottom: '16px' }}
                  >
                    {title}
                  </h2>
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">项目介绍</h3>
                    <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                      {projectDescription}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">薪资范围</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {salaryRange.perHour}，总预算 {salaryRange.totalBudget}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">职位要求</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-sm">
                      {jobRequirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">工作方式</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {workMode}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    预计持续时间：{duration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    位置：{location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    已花费：{spent}
                  </p>
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

                <div className="absolute bottom-16 right-1 flex flex-col space-y-6 z-10">
                  <div className="flex space-x-1.5 mb-0">
                    <button
                      onClick={scrollLeft}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-900 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={scrollRight}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-900 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-center relative">
                    <img
                      src="/favicon.svg"
                      alt="User Avatar"
                      className="w-14 h-14 rounded-full border-2 border-gray-500"
                    />
                    <button className="absolute top-11 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
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

                  <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="gray" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-sm">{likes || 0}</span>
                  </button>

                  <button 
                    onClick={() => openComments(index)}
                    className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <span className="text-sm">{comments || 0}</span>
                  </button>

                  <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">
                    <svg className="w-10 h-10" fill="none" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path>
                    </svg>
                    <span className="text-sm">{favorites || 0}</span>
                  </button>

                  <button className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                    <svg className="w-10 h-10" fill="" stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-12 5H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <span className="text-sm">{shares || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      <div className="bg-gray-100 fixed bottom-0 sm:hidden flex items-center justify-between w-full px-6">
        <button
          className={`text-[1.2rem] ${selected === 'home' ? 'text-black' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('home')}
        >
          首页
        </button>
        <button
          className={`text-[1.2rem] ${selected === 'shop' ? 'text-black' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('shop')}
        >
          商城
        </button>
        <Link to="/login" className="text-white">
          <img
            src="./plus.svg"
            alt="Plus Icon"
            className="w-9 h-9 "
          />
        </Link>
        <button
          className={`text-[1.2rem] ${selected === 'messages' ? 'text-black' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('messages')}
        >
          消息
        </button>
        <button
          className={`text-[1.2rem] ${selected === 'me' ? 'text-black' : 'text-gray-400 dark:text-gray-200'}`}
          onClick={() => setSelected('me')}
        >
          我
        </button>
      </div>
    </>
  );
}