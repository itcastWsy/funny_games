import { showSuccessToast, showFailToast } from 'vant';

interface UserData {
  username: string;
  password: string;
}

export const validateAuth = (username: string, password: string): string | null => {
  if (!username.trim()) {
    showFailToast('用户名不能为空');
    return '用户名不能为空';
  }
  if (!password.trim()) {
    showFailToast('密码不能为空');
    return '密码不能为空';
  }
  if (password.length < 6) {
    showFailToast('密码长度不能少于6位');
    return '密码长度不能少于6位';
  }
  return null;
};

export const register = (userData: UserData): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find((u: UserData) => u.username === userData.username);
  
  if (existingUser) {
    showFailToast('用户名已存在');
    return false;
  }

  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
  showSuccessToast('注册成功');
  return true;
};

export const login = (userData: UserData): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    (u: UserData) => u.username === userData.username && u.password === userData.password
  );

  if (user) {
    localStorage.setItem('currentUser', userData.username);
    showSuccessToast('登录成功');
    return true;
  }
  
  showFailToast('用户名或密码错误');
  return false;
};