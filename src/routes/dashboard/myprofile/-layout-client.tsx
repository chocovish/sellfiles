import { useLocation } from "@tanstack/react-router";

export function PathNameProvider({ children }: { children: React.ReactNode }) {
  const pathname = useLocation().pathname;
  
  // Determine the appropriate class based on the pathname
  let pathClass = '';
  
  if (pathname === '/dashboard/myprofile') {
    pathClass = 'pathname-myprofile';
  } else if (pathname === '/dashboard/myprofile/payment') {
    pathClass = 'pathname-payment';
  } else if (pathname === '/dashboard/myprofile/purchases') {
    pathClass = 'pathname-purchases';
  }
  
  return (
    <div className={pathClass}>
      {children}
    </div>
  );
} 