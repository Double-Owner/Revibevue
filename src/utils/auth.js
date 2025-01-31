export function getUserRoleFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
      return payload.role || null;
    } catch (error) {
      console.error("JWT 디코딩 오류:", error);
      return null;
    }
  }
  
  