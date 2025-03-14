export default function WeChatRedirect() {
    return (
      <div className="flex flex-col items-start justify-start h-screen bg-white p-6">
        {/* Image Placeholder */}
        <div className="mt-3 w-full">
          <img
            src="/arrow.png"
            alt="WeChat Browser Interface"
            className="max-w-full h-auto w-1/2 block ml-auto"
          />
        </div>
        {/* Step 1 */}
        <div className="flex items-center mb-6 w-full mt-3">
          <span className="inline-block w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
            1
          </span>
          <h1 className="text-2xl text-black text-left">
            点击右上角三个点
          </h1>
        </div>  
        {/* Step 2 */}
        <div className="flex items-center mb-0 w-full">
          <span className="inline-block w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
            2
          </span>
          <h1 className="text-2xl text-black text-left">
            选择在浏览器打开
          </h1>
        </div>
  
        {/* Image Placeholder */}
        <div className="mt-3 w-full">
          <img
            src="/explorer.png"
            alt="WeChat Browser Interface"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    );
  }