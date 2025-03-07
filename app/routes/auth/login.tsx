import React, { useState, useEffect } from "react";
import { Link } from "react-router"; // 引入 Link 组件

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState(""); // 手机号
  const [verificationCode, setVerificationCode] = useState(""); // 验证码
  const [error, setError] = useState<string | null>(null);
  const [canGetCode, setCanGetCode] = useState(false); // 控制是否可以获取验证码

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !verificationCode) {
      setError("手机号和验证码不能为空");
      return;
    }
    console.log("提交登录信息：", phoneNumber, verificationCode);
    setError(null);
  };

  // 判断手机号是否已输入，进而启用获取验证码按钮
  useEffect(() => {
    setCanGetCode(!!phoneNumber && phoneNumber.length === 11); // 如果手机号输入为11位，启用获取验证码按钮
  }, [phoneNumber]);

  // 判断是否满足输入手机号和验证码
  const isFormValid = phoneNumber.length === 11 && verificationCode.length > 0;

return (
  <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
    {/* 返回主页按钮 */}
    <Link
      to="/"
    >
      {/* 使用本地的 back.svg 图标 */}
      <img
              src="/back.svg" // 引用 public 目录下的文件
              alt="返回主页按钮"
              style={{ width: "25px", height: "25px" ,}}
            />
    </Link>

      <h2 style={{ fontSize: "23px", fontWeight: "bold", marginBottom: "20px", marginTop: "60px", color: "gray",}}>
        验证码登录
      </h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
              padding: "0", // 取消内边距，避免覆盖
            }}
          >
            <select
              disabled
              style={{
                width: "67px",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                padding: "8px",
                marginRight: "10px",
              }}
            >
              <option value="+86">+86</option>
              <option value="+1" disabled>+1</option>
              <option value="+44" disabled>+44</option>
            </select>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="手机号"
              style={{
                width: "calc(100% - 70px)",
                padding: "8px",
                border: "none",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                outline: "none", // 去除黑框
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f0f0f0",
            }}
          >
            <input
              type="password"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="请输入验证码"
              style={{
                width: "80%",
                padding: "8px",
                border: "none",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                outline: "none", // 去除黑框
              }}
            />
            <button
              type="button"
              disabled={!canGetCode}
              style={{
                marginLeft: "10px",
                padding: "8px 12px",
                color: canGetCode ? "#F44336" : "#888", // 从灰色变成红色
                border: "none",
                borderRadius: "4px",
                cursor: canGetCode ? "pointer" : "not-allowed",
                transition: "background-color 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onClick={() => console.log("获取验证码")}
            >
              获取验证码
            </button>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isFormValid ? "#f44336" : "#FFCDD2", // 红色和淡红色
            color: "white",
            border: "none",
            cursor: isFormValid ? "pointer" : "not-allowed",
            borderRadius: "4px",
          }}
          disabled={!isFormValid} // 按钮只有在表单有效时才能提交
        >
          登录/注册
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>第三方登录</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            onClick={() => console.log("使用 Telegram 登录")}
          >
            {/* 使用本地的 telegram.svg 图标 */}
            <img
              src="/telegram.svg" // 引用 public 目录下的文件
              alt="Telegram 登录"
              style={{ width: "31px", height: "31px" }}
            />
          </button>
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            onClick={() => console.log("使用 Google 登录")}
          >
            {/* 使用本地的 google.svg 图标 */}
            <img
              src="/google.svg" // 引用 public 目录下的文件
              alt="Google 登录"
              style={{ width: "25px", height: "25px" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
