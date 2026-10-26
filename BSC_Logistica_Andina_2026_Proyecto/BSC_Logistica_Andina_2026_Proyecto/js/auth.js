/* ===== Conexión y gestión de usuarios ===== */
const USERS = {
  "admin": { password:"bsc2026", name:"Administrador Sistema", role:"Superadmin BSC", initials:"AD" },
  "jose.aroapaza": { password:"andina2026", name:"Jose Aroapaza", role:"Gerente Operaciones", initials:"JA" }
};

function checkSession(){
  const raw=localStorage.getItem("bsc_session_user");
  if(raw){ const u=JSON.parse(raw); setUser(u); $("#authOverlay").classList.add("hidden"); }
}
function handleLogin(e){
  e.preventDefault();
  const id=$("#loginUser").value.trim(), pass=$("#loginPass").value.trim();
  const u=USERS[id];
  if(u && u.password===pass){
    const session={name:u.name,role:u.role,initials:u.initials};
    if($("#rememberMe").checked) localStorage.setItem("bsc_session_user",JSON.stringify(session));
    setUser(session); $("#authOverlay").classList.add("hidden");
    showToast("¡Bienvenido, "+u.name+"!");
  } else alert("Usuario o contraseña incorrectos.");
}
function setUser(u){ $("#userName").innerText=u.name; $("#userRole").innerText=u.role; $("#userAvatar").innerText=u.initials; }
function logout(e){ if(e)e.stopPropagation(); localStorage.removeItem("bsc_session_user"); $("#authOverlay").classList.remove("hidden"); $("#userMenu").classList.remove("show"); showToast("Sesión cerrada correctamente"); }
function toggleUserMenu(){ $("#userMenu").classList.toggle("show"); }
function showToast(msg){ $("#toastMsg").innerText=msg; $("#toastBox").classList.add("show"); setTimeout(()=>$("#toastBox").classList.remove("show"),3000); }
