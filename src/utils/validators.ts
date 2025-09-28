export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateResumeData = (data: { name?: string; email?: string; phone?: string }) => {
  const errors: string[] = [];
  
  if (!data.name || !validateName(data.name)) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
