Import { useState, useRef } from "react";

const PRESET_COLORS = ["#34456c","#8B2252","#2E86AB","#A23B72","#F18F01","#C73E1D","#44BBA4","#E94F37","#6B4226","#7B2D8B","#1B998B","#393E41"];
const CONTENT_TYPES = ["Reel","Carrusel","Historia","Post estático"];
const NETWORKS = ["Instagram","LinkedIn","TikTok","Facebook"];
const STATUSES = ["Borrador","Programado Hootsuite","Subir manual","Publicado"];
const STATUS_COLORS = {"Borrador":"#aaa","Programado Hootsuite":"#2E86AB","Subir manual":"#E8A838","Publicado":"#5BAD8F"};
const TYPE_COLORS = {
  "Reel":      {bg:"#ede9fe", text:"#5b21b6"},
  "Carrusel":  {bg:"#dbeafe", text:"#1d4ed8"},
  "Historia":  {bg:"#d1fae5", text:"#065f46"},
  "Post estático": {bg:"#f3f4f6", text:"#374151"},
};
const COLLAB_COLOR = {bg:"#fef3c7", text:"#92400e"};
const NET_COLORS = {"Instagram":"#E1306C","LinkedIn":"#0077B5","TikTok":"#333","Facebook":"#1877F2"};
const PERFORMANCE = [
  {value:"good",label:"Funcionó",color:"#5BAD8F",bg:"#5BAD8F15"},
  {value:"ok",label:"Más o menos",color:"#E8A838",bg:"#E8A83815"},
  {value:"bad",label:"No funcionó",color:"#C73E1D",bg:"#C73E1D15"},
];
const METRIC_OPTS = [
  ["posts","Publicaciones","#8B2252"],["shares","Comparticiones","#2E86AB"],["followers","Seguidores","#44BBA4"],
  ["impressions_pub","Impresiones","#A23B72"],["reach","Alcance","#E8A838"],["reactions","Reacciones","#C73E1D"],
  ["messages","Mensajes","#34456c"],["video_views","Visualizaciones","#6B4226"],["profile_reach","Alcance perfil","#1B998B"],
  ["interaction_rate","Tasa interacción (%)","#7B2D8B"],["comments","Comentarios","#E94F37"],
];
const CAMPAIGN_METRIC_FIELDS = [
  ["camp_reach","Alcance total","#2E86AB"],["camp_engagement","Engagement total","#8B2252"],
  ["camp_engagement_rate","Tasa engagement (%)","#7B2D8B"],["camp_clicks","Clics","#E8A838"],["camp_new_followers","Nuevos seguidores","#44BBA4"],
];
const COLLAB_FIELDS = [
  ["col_reach","Alcance","#2E86AB"],["col_impressions","Impresiones","#A23B72"],
  ["col_engagement","Engagement total","#8B2252"],["col_engagement_rate","Tasa engagement (%)","#7B2D8B"],
  ["col_clicks","Clics al link","#E8A838"],["col_new_followers","Nuevos seguidores","#44BBA4"],
];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const today = new Date();
const BG = "#f5f6f0";
const NAVY = "#34456c";
const initialBrands = [
  {id:1,name:"Wine & Tapas",color:"#8B2252",colorSecondary:"#f5e6ed",logo:null},
  {id:2,name:"Oliva Nova",color:"#2E86AB",colorSecondary:"#e6f3f8",logo:null},
  {id:3,name:"Demo Brand",color:"#44BBA4",colorSecondary:"#e6f7f5",logo:null},
];
const emptyMetrics={posts:"",shares:"",followers:"",impressions_pub:"",reach:"",reactions:"",messages:"",video_views:"",profile_reach:"",interaction_rate:"",comments:""};
const emptyCampaignM={camp_reach:"",camp_engagement:"",camp_engagement_rate:"",camp_clicks:"",camp_new_followers:"",camp_star_post:null,camp_notes:""};
const emptyCollabM={col_reach:"",col_impressions:"",col_engagement:"",col_engagement_rate:"",col_clicks:"",col_new_followers:"",col_discount_code:"",col_code_uses:"",col_notes:""};
const emptyForm={title:"",type:"Reel",network:["Instagram"],status:"Borrador",copy:"",hashtags:"",hour:"12:00",brandId:null,date:"",performance:null,fileUrl:null,fileName:null,carouselFiles:[],campaignId:null,contentKind:"own",influencerName:""};

function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate();}
function getFirstDay(y,m){let d=new Date(y,m,1).getDay();return d===0?6:d-1;}

function NetBadges({networks,color}){
  const arr=Array.isArray(networks)?networks:(networks?[networks]:[]);
  return <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{arr.map(n=><span key={n} style={{fontSize:9,padding:"2px 6px",borderRadius:20,background:(color||"#888")+"22",color:color||"#888",fontWeight:500,border:"1px solid "+(color||"#888")+"33"}}>{n}</span>)}</div>;
}
function NetworkPicker({value,onChange}){
  const arr=Array.isArray(value)?value:(value?[value]:[]);
  return <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{NETWORKS.map(n=>{const a=arr.includes(n);return <button key={n} type="button" onClick={()=>onChange(a?arr.filter(x=>x!==n):[...arr,n])} style={{padding:"5px 12px",borderRadius:20,border:"1px solid "+(a?NET_COLORS[n]:"#ddd"),background:a?NET_COLORS[n]+"15":"#fafafa",color:a?NET_COLORS[n]:"#888",fontSize:12,cursor:"pointer",fontWeight:a?600:400}}>{n}</button>;})}</div>;
}
function PlaceholderBox({label,ratio}){
  return <div style={{width:"100%",aspectRatio:ratio,borderRadius:8,background:"#eee",border:"1.5px dashed #ccc",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>{label}</span></div>;
}
function ReelPreview({file}){
  const ref=useRef();const[p,setP]=useState(false);
  if(!file)return <PlaceholderBox label="Subí un video" ratio="9/16"/>;
  return <div style={{position:"relative",width:"100%",aspectRatio:"9/16",background:"#111",borderRadius:8,overflow:"hidden"}}>
    <video ref={ref} src={file} style={{width:"100%",height:"100%",objectFit:"cover"}} onClick={()=>{p?ref.current.pause():ref.current.play();setP(x=>!x);}}/>
    {!p&&<div onClick={()=>{ref.current.play();setP(true);}} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><div style={{width:48,height:48,borderRadius:"50%",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:20,marginLeft:3}}>▶</span></div></div>}
  </div>;
}
function StaticPreview({file,ratio}){
  const r=ratio||"1/1";
  if(!file)return <PlaceholderBox label="Subí una imagen" ratio={r}/>;
  return <div style={{width:"100%",aspectRatio:r,borderRadius:8,overflow:"hidden",background:"#111"}}><img src={file} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>;
}
function CarouselPreview({files,onReorder,editable}){
  const[idx,setIdx]=useState(0);const[drag,setDrag]=useState(null);
  if(!files||files.length===0)return <PlaceholderBox label="Subí imágenes del carrusel" ratio="1/1"/>;
  const move=dir=>setIdx(i=>Math.max(0,Math.min(files.length-1,i+dir)));
  const drop=i=>{if(drag===null||drag===i)return;const a=[...files];const[it]=a.splice(drag,1);a.splice(i,0,it);onReorder&&onReorder(a);setDrag(null);if(idx>=a.length)setIdx(Math.max(0,a.length-1));};
  return <div>
    <div style={{position:"relative",width:"100%",aspectRatio:"1/1",borderRadius:8,overflow:"hidden",background:"#111"}}>
      <img src={files[idx]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
      {files.length>1&&<>
        <button onClick={()=>move(-1)} disabled={idx===0} style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.85)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,opacity:idx===0?0.3:1}}>‹</button>
        <button onClick={()=>move(1)} disabled={idx===files.length-1} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.85)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,opacity:idx===files.length-1?0.3:1}}>›</button>
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>{files.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:5,height:5,borderRadius:"50%",background:i===idx?"#fff":"rgba(255,255,255,0.5)",cursor:"pointer"}}/>)}</div>
        <div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.45)",color:"#fff",fontSize:10,padding:"2px 7px",borderRadius:10}}>{idx+1}/{files.length}</div>
      </>}
    </div>
    {editable&&files.length>1&&<div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
      {files.map((f,i)=><div key={i} draggable onDragStart={()=>setDrag(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(i)} onClick={()=>setIdx(i)} style={{position:"relative",width:44,height:44,borderRadius:5,overflow:"hidden",cursor:"grab",border:i===idx?"2px solid #333":"2px solid transparent",flexShrink:0,opacity:drag===i?0.4:1}}>
        <img src={f} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        {onReorder&&<button onClick={e=>{e.stopPropagation();const a=files.filter((_,j)=>j!==i);onReorder(a);if(idx>=a.length)setIdx(Math.max(0,a.length-1));}} style={{position:"absolute",top:1,right:1,width:14,height:14,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",cursor:"pointer",fontSize:9,lineHeight:"14px",textAlign:"center",padding:0}}>×</button>}
      </div>)}
    </div>}
  </div>;
}
function MediaPreview({post,onReorder,editable}){
  if(post.type==="Reel")return <ReelPreview file={post.fileUrl}/>;
  if(post.type==="Historia")return <StaticPreview file={post.fileUrl} ratio="9/16"/>;
  if(post.type==="Post estático")return <StaticPreview file={post.fileUrl} ratio="1/1"/>;
  if(post.type==="Carrusel")return <CarouselPreview files={post.carouselFiles} onReorder={onReorder} editable={editable}/>;
  return null;
}

export default function App(){
  const[brands,setBrands]=useState(initialBrands);
  const[posts,setPosts]=useState([]);
  const[todos,setTodos]=useState([
    {id:1,text:"Enviar informe métricas",desc:"Preparar PDF con resultados de febrero",done:false,when:"Hoy",brandId:1,date:""},
    {id:2,text:"Revisar brief campaña verano",desc:"Ver propuesta y dar feedback al equipo",done:false,when:"Mañana",brandId:null,date:""},
    {id:3,text:"Subir contenido Wine & Tapas",desc:"Posts semana del 17 al 23",done:true,when:"Hecho",brandId:1,date:""},
    {id:4,text:"Contactar influencer @maria",desc:"Negociar condiciones collab abril",done:false,when:"Esta semana",brandId:2,date:""},
  ]);
  const[showTodoModal,setShowTodoModal]=useState(false);
  const[todoForm,setTodoForm]=useState({text:"",desc:"",date:"",brandId:null});
  const[newTodo,setNewTodo]=useState("");
  const[campaigns,setCampaigns]=useState([
    {id:1,name:"San Valentín 2026",color:"#E94F37",dateStart:"2026-02-01",dateEnd:"2026-02-14",description:"",brandIds:[1,2]},
    {id:2,name:"Verano 2026",color:"#E8A838",dateStart:"2026-06-01",dateEnd:"2026-09-01",description:"",brandIds:[1,2]},
  ]);
  const[campaignMetrics,setCampaignMetrics]=useState([]);
  const[collabMetrics,setCollabMetrics]=useState([]);
  const[view,setView]=useState("home");
  const[viewStack,setViewStack]=useState([]);
  const[activeBrand,setActiveBrand]=useState(null);
  const[activePost,setActivePost]=useState(null);
  const[activeCampaign,setActiveCampaign]=useState(null);
  const[activeCollab,setActiveCollab]=useState(null);
  const[calYear,setCalYear]=useState(today.getFullYear());
  const[calMonth,setCalMonth]=useState(today.getMonth());
  const[showMonthPosts,setShowMonthPosts]=useState(false);
  const[notification,setNotification]=useState(null);
  const[activeMetric,setActiveMetric]=useState("reach");
  const[featuredPosts,setFeaturedPosts]=useState({});
  const[form,setForm]=useState({...emptyForm});
  const[brandForm,setBrandForm]=useState({name:"",color:NAVY,colorSecondary:"#e8eaf2",logo:null});
  const[campaignForm,setCampaignForm]=useState({name:"",color:"#E8A838",dateStart:"",dateEnd:"",description:"",brandIds:[]});
  const[metricsForm,setMetricsForm]=useState({month:today.getMonth(),year:today.getFullYear(),...emptyMetrics});
  const[campaignMetricsForm,setCampaignMetricsForm]=useState({...emptyCampaignM});
  const[collabMetricsForm,setCollabMetricsForm]=useState({...emptyCollabM});
  const[metrics,setMetrics]=useState([]);

  const theme=activeBrand
    ?{primary:activeBrand.color,secondary:activeBrand.colorSecondary||"#f0f0f0",accent:activeBrand.color+"18"}
    :{primary:NAVY,secondary:"#e8eaf2",accent:NAVY+"12"};

  // Navigation with back stack
  const goTo=(v,resetBrand)=>{
    setViewStack(s=>[...s,{view,activeBrand}]);
    setView(v);
    if(resetBrand!==undefined) setActiveBrand(resetBrand);
  };
  const goBack=()=>{
    if(viewStack.length===0) return;
    const prev=viewStack[viewStack.length-1];
    setViewStack(s=>s.slice(0,-1));
    setView(prev.view);
    if(prev.activeBrand!==undefined) setActiveBrand(prev.activeBrand);
  };

  const notify=(msg,type)=>{const t=type||"success";setNotification({msg,t});setTimeout(()=>setNotification(null),3000);};
  const brandById=id=>brands.find(b=>b.id===id);
  const campaignById=id=>campaigns.find(c=>c.id===id);
  const brandPosts=bId=>posts.filter(p=>p.brandId===bId);
  const collabPostsFn=bId=>posts.filter(p=>p.brandId===bId&&p.contentKind==="collab");
  const postsOnDay=(y,m,d,bId)=>posts.filter(p=>{const dt=new Date(p.date);return dt.getFullYear()===y&&dt.getMonth()===m&&dt.getDate()===d&&(!bId||p.brandId===bId);});
  const postsInMonth=(y,m,bId)=>posts.filter(p=>{const dt=new Date(p.date);return dt.getFullYear()===y&&dt.getMonth()===m&&(!bId||p.brandId===bId);}).sort((a,b)=>new Date(a.date)-new Date(b.date));

  const openNewPost=(date,bId)=>{setForm({...emptyForm,brandId:bId||(activeBrand?activeBrand.id:(brands[0]?brands[0].id:null)),date:date||""});setActivePost(null);goTo("post");};
  const openPost=post=>{setForm({...post,carouselFiles:post.carouselFiles||[],network:Array.isArray(post.network)?post.network:[post.network].filter(Boolean)});setActivePost(post);goTo("post");};

  const savePost=()=>{
    if(!form.title||!form.date){notify("Completá título y fecha","error");return;}
    if(!form.network||form.network.length===0){notify("Seleccioná al menos una red","error");return;}
    if(activePost){setPosts(ps=>ps.map(p=>p.id===activePost.id?{...form,id:p.id}:p));}
    else{setPosts(ps=>[...ps,{...form,id:Date.now()}]);}
    notify("Post guardado");setActivePost(null);goBack();
  };
  const deletePost=id=>{setPosts(ps=>ps.filter(p=>p.id!==id));notify("Post eliminado");setActivePost(null);goBack();};
  const setPerf=(postId,perf)=>setPosts(ps=>ps.map(p=>p.id===postId?{...p,performance:perf}:p));

  const saveBrand=()=>{
    if(!brandForm.name){notify("Ingresá un nombre","error");return;}
    const editing=view==="editBrand";
    if(editing){setBrands(bs=>bs.map(b=>b.id===activeBrand.id?{...brandForm,id:b.id}:b));notify("Marca actualizada");}
    else{setBrands(bs=>[...bs,{...brandForm,id:Date.now()}]);notify("Marca creada");}
    goBack();
  };

  const saveCampaign=()=>{
    if(!campaignForm.name){notify("Ingresá un nombre","error");return;}
    if(!campaignForm.brandIds||campaignForm.brandIds.length===0){notify("Seleccioná al menos una marca","error");return;}
    if(activeCampaign){
      setCampaigns(cs=>cs.map(c=>c.id===activeCampaign.id?{...campaignForm,id:c.id}:c));
      notify("Campaña actualizada");
    } else {
      setCampaigns(cs=>[...cs,{...campaignForm,id:Date.now()}]);
      notify("Campaña creada");
    }
    setActiveCampaign(null);goBack();
  };
  const deleteCampaign=id=>{setCampaigns(cs=>cs.filter(c=>c.id!==id));setPosts(ps=>ps.map(p=>p.campaignId===id?{...p,campaignId:null}:p));notify("Campaña eliminada");setActiveCampaign(null);goBack();};

  const saveMetrics=()=>{const idx=metrics.findIndex(m=>m.brandId===activeBrand.id&&m.month===metricsForm.month&&m.year===metricsForm.year);const data={...metricsForm,brandId:activeBrand.id};if(idx>=0){setMetrics(ms=>ms.map((m,i)=>i===idx?data:m));}else{setMetrics(ms=>[...ms,data]);}notify("Métricas guardadas");};
  const saveCollabMetrics=postId=>{const idx=collabMetrics.findIndex(m=>m.postId===postId);const data={...collabMetricsForm,postId};if(idx>=0){setCollabMetrics(ms=>ms.map((m,i)=>i===idx?data:m));}else{setCollabMetrics(ms=>[...ms,data]);}notify("Métricas guardadas");};
  const saveCampaignMetricsFn=()=>{const idx=campaignMetrics.findIndex(m=>m.campaignId===activeCampaign.id);const data={...campaignMetricsForm,campaignId:activeCampaign.id};if(idx>=0){setCampaignMetrics(ms=>ms.map((m,i)=>i===idx?data:m));}else{setCampaignMetrics(ms=>[...ms,data]);}notify("Métricas guardadas");};

  const toggleFeatured=(bId,postId)=>{setFeaturedPosts(fp=>{const cur=fp[bId]||[];if(cur.includes(postId))return{...fp,[bId]:cur.filter(id=>id!==postId)};if(cur.length>=4){notify("Máximo 4 publicaciones","error");return fp;}return{...fp,[bId]:[...cur,postId]};});};
  const getFeatured=bId=>(featuredPosts[bId]||[]).map(id=>posts.find(p=>p.id===id)).filter(Boolean);
  const prevMonth=()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);};
  const nextMonth=()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);};
  const handleFileUpload=e=>{const f=e.target.files[0];if(!f)return;setForm(fm=>({...fm,fileUrl:URL.createObjectURL(f),fileName:f.name}));};
  const handleCarouselUpload=e=>{const fs=Array.from(e.target.files);setForm(fm=>({...fm,carouselFiles:[...(fm.carouselFiles||[]),...fs.map(f=>URL.createObjectURL(f))]}));};
  const handleLogoUpload=e=>{const f=e.target.files[0];if(!f)return;setBrandForm(fm=>({...fm,logo:URL.createObjectURL(f)}));};

  const addTodo=()=>{
    const text=newTodo.trim();
    if(!text) return;
    setTodos(ts=>[...ts,{id:Date.now(),text,desc:"",date:"",brandId:null,done:false,when:"Esta semana"}]);
    setNewTodo("");
  };
  const toggleTodo=id=>setTodos(ts=>ts.map(t=>t.id===id?{...t,done:!t.done,when:!t.done?"Hecho":t.when}:t));
  const deleteTodo=id=>setTodos(ts=>ts.filter(t=>t.id!==id));

  const s={
    input:{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #dde0d5",background:"#fff",color:"#2c2c2a",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"},
    label:{fontSize:11,color:"#888",marginBottom:5,display:"block",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"},
    card:{background:"#fff",borderRadius:12,border:"1px solid #e4e6de",padding:"16px 18px"},
    btn:{padding:"7px 16px",fontSize:12,borderRadius:8,border:"1px solid #dde0d5",background:"#fff",cursor:"pointer",color:"#444",fontFamily:"inherit",fontWeight:500},
    btnP:{padding:"8px 20px",fontSize:13,borderRadius:8,border:"none",background:theme.primary,color:BG,cursor:"pointer",fontWeight:600,fontFamily:"inherit"},
    btnBack:{padding:"6px 12px",fontSize:12,borderRadius:8,border:"1px solid rgba(245,246,240,0.3)",background:"rgba(245,246,240,0.15)",cursor:"pointer",color:BG,fontFamily:"inherit",fontWeight:500,display:"flex",alignItems:"center",gap:5},
  };
  const tag=(color)=>({fontSize:10,padding:"2px 8px",borderRadius:20,background:color+"18",color:color,fontWeight:600,border:"1px solid "+color+"25"});

  const MiniChart=({data,metric,color})=>{
    if(!data||data.length<2)return null;
    const vals=data.map(d=>+(d[metric])||0);const max=Math.max(...vals)||1;const min=Math.min(...vals);
    const W=300,H=70,P=10;
    const x=i=>P+(i/(data.length-1))*(W-P*2);const y=v=>H-P-(((v-min)/(max-min||1))*(H-P*2));
    const pts=data.map((d,i)=>x(i)+","+y(+(d[metric])||0)).join(" ");
    const area="M"+x(0)+","+(H-P)+" "+data.map((d,i)=>"L"+x(i)+","+y(+(d[metric])||0)).join(" ")+" L"+x(data.length-1)+","+(H-P)+" Z";
    return <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:70}}>
      <path d={area} fill={color} opacity="0.1"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      {data.map((d,i)=><g key={i}><circle cx={x(i)} cy={y(+(d[metric])||0)} r="3" fill={color}/><text x={x(i)} y={H+2} textAnchor="middle" fontSize="8" fill="#bbb">{MONTHS[d.month].slice(0,3)}</text></g>)}
    </svg>;
  };

  // ── Topbar ─────────────────────────────────────────────────────────────────
  const renderTopbar=()=>{
    const showBack=viewStack.length>0;
    return <div style={{background:NAVY,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {/* Home button — always visible */}
        <button onClick={()=>{setView("home");setActiveBrand(null);setViewStack([]);setShowMonthPosts(false);}} style={{...s.btnBack,padding:"6px 10px",fontSize:16,lineHeight:1}} title="Inicio">⌂</button>
        {showBack&&<button onClick={goBack} style={s.btnBack}>← Volver</button>}
        <div style={{display:"flex",flexDirection:"column",lineHeight:1.1,marginLeft:4}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:BG,letterSpacing:"0.5px"}}>THE</span>
            <span style={{fontFamily:"Georgia,serif",fontSize:13,fontStyle:"italic",color:BG}}>social</span>
          </div>
          <span style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:700,color:BG,letterSpacing:"0.5px"}}>HUB</span>
        </div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {activeBrand&&<>
          <button onClick={()=>goTo("metrics")} style={{...s.btn,background:"transparent",border:"1px solid rgba(245,246,240,0.3)",color:BG,fontSize:11}}>Métricas</button>
          <button onClick={()=>{setBrandForm({...activeBrand});goTo("editBrand");}} style={{...s.btn,background:"transparent",border:"1px solid rgba(245,246,240,0.3)",color:BG,fontSize:11}}>⚙</button>
          <button onClick={()=>openNewPost(null,activeBrand.id)} style={{...s.btnP,fontSize:12,padding:"6px 14px",background:BG,color:NAVY}}>+ Post</button>
        </>}
        {!activeBrand&&<>
          <button onClick={()=>{setActiveCampaign(null);goTo("campaigns");}} style={{...s.btn,background:"transparent",border:"1px solid rgba(245,246,240,0.3)",color:BG,fontSize:11}}>Campañas</button>
          <button onClick={()=>{setActiveBrand(null);setBrandForm({name:"",color:NAVY,colorSecondary:"#e8eaf2",logo:null});goTo("newBrand");}} style={{...s.btnP,fontSize:12,padding:"6px 14px",background:BG,color:NAVY}}>+ Marca</button>
        </>}
      </div>
    </div>;
  };

  // ── Calendar ───────────────────────────────────────────────────────────────
  const renderCalendar=(bId)=>{
    const days=getDaysInMonth(calYear,calMonth),first=getFirstDay(calYear,calMonth);
    const cells=[];for(let i=0;i<first;i++)cells.push(null);for(let d=1;d<=days;d++)cells.push(d);
    const isToday=d=>d&&calYear===today.getFullYear()&&calMonth===today.getMonth()&&d===today.getDate();
    return <div style={{background:"#fff",borderRadius:14,border:"1px solid #e4e6de",padding:"16px",marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button onClick={prevMonth} style={{...s.btn,padding:"4px 10px",borderRadius:8}}>‹</button>
        <span style={{fontFamily:"Georgia,serif",fontSize:15,color:"#2c2c2a",fontWeight:400}}>{MONTHS[calMonth]} {calYear}</span>
        <button onClick={nextMonth} style={{...s.btn,padding:"4px 10px",borderRadius:8}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:4}}>
        {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:"#bbb",padding:"4px 0",fontWeight:600,letterSpacing:"0.3px"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          const dp=d?postsOnDay(calYear,calMonth,d,bId):[];
          const itd=isToday(d);
          return <div key={i} onClick={()=>d&&openNewPost(calYear+"-"+String(calMonth+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"),bId)}
            style={{minHeight:60,background:itd?NAVY+"10":BG,borderRadius:6,padding:"4px",cursor:d?"pointer":"default",opacity:d?1:0,border:itd?"1.5px solid "+NAVY+"44":"1px solid #e8eadf"}}>
            {d&&(itd
              ?<div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:"50%",background:NAVY,marginBottom:2}}><span style={{fontSize:10,fontWeight:700,color:BG}}>{d}</span></div>
              :<div style={{fontSize:10,fontWeight:500,marginBottom:2,color:"#999"}}>{d}</div>
            )}
            {dp.slice(0,2).map(p=>{
              const b=brandById(p.brandId);
              return <div key={p.id} onClick={e=>{e.stopPropagation();openPost(p);}}
                style={{fontSize:9,borderRadius:10,padding:"1px 5px",marginBottom:1,background:bId?STATUS_COLORS[p.status]+"22":(b?b.color+"18":"#eee"),color:bId?STATUS_COLORS[p.status]:(b?b.color:"#888"),overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",cursor:"pointer",fontWeight:600,border:"1px solid "+(bId?STATUS_COLORS[p.status]+"33":(b?b.color+"33":"#ddd"))}}>
                {p.title}
              </div>;
            })}
            {dp.length>2&&<div style={{fontSize:8,color:"#bbb"}}>+{dp.length-2}</div>}
          </div>;
        })}
      </div>
      {/* Legend */}
      {!bId&&<div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:14,paddingTop:12,borderTop:"1px solid #eee"}}>
        {brands.map(b=><div key={b.id} style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:b.color}}/>
          <span style={{fontSize:11,color:"#666"}}>{b.name}</span>
        </div>)}
      </div>}
    </div>;
  };

  // ── Todo List ──────────────────────────────────────────────────────────────
  const whenColor=w=>{if(w==="Hoy")return"#E94F37";if(w==="Mañana")return"#E8A838";if(w==="Hecho")return"#5BAD8F";return NAVY;};
  const renderTodo=()=>{
    const active=todos.filter(t=>!t.done);const done=todos.filter(t=>t.done);
    return <div style={{background:"#fff",borderRadius:14,border:"1px solid #e4e6de",padding:"16px 18px"}}>
      <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:"0.8px",marginBottom:12}}>TO-DO</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} placeholder="Nueva tarea..." style={{...s.input,flex:1}}/>
        <button onClick={addTodo} style={{...s.btnP,padding:"8px 14px",fontSize:12,whiteSpace:"nowrap"}}>+ Añadir</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {[...active,...done].map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:t.done?"#f9faf5":"#fafaf9",border:"1px solid "+(t.done?"#e0e4d5":"#e8eadf"),opacity:t.done?0.6:1}}>
          <div onClick={()=>toggleTodo(t.id)} style={{width:16,height:16,borderRadius:"50%",border:"1.5px solid "+(t.done?NAVY:"#ccc"),background:t.done?NAVY:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {t.done&&<span style={{color:BG,fontSize:9,lineHeight:1}}>✓</span>}
          </div>
          <span style={{fontSize:12,flex:1,textDecoration:t.done?"line-through":"none",color:t.done?"#aaa":"#333",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.text}</span>
          {t.when&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:10,background:whenColor(t.when)+"18",color:whenColor(t.when),fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{t.when}</span>}
          <button onClick={()=>deleteTodo(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:14,padding:0,flexShrink:0}}>×</button>
        </div>)}
      </div>
    </div>;
  };

  // ── Post Card ──────────────────────────────────────────────────────────────
  const PostCard=({post})=>{
    const b=brandById(post.brandId);const perf=PERFORMANCE.find(p=>p.value===post.performance);const camp=campaignById(post.campaignId);
    const reorder=nf=>setPosts(ps=>ps.map(p=>p.id===post.id?{...p,carouselFiles:nf}:p));
    return <div style={{background:"#fff",borderRadius:12,border:"1px solid #e4e6de",overflow:"hidden"}}>
      <div style={{background:b?b.color:NAVY,padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:2}}>{post.title}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{post.date} · {post.hour}</div>
            <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
              {camp&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:10,background:"rgba(255,255,255,0.2)",color:"#fff"}}>📣 {camp.name}</span>}
              {post.contentKind==="collab"&&<span style={{fontSize:9,padding:"1px 7px",borderRadius:10,background:"rgba(255,255,255,0.2)",color:"#fff"}}>🤝 {post.influencerName}</span>}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
            <span style={{fontSize:9,padding:"2px 7px",borderRadius:10,background:"rgba(255,255,255,0.2)",color:"#fff",fontWeight:500}}>{post.type}</span>
            <NetBadges networks={post.network} color="#fff"/>
          </div>
        </div>
      </div>
      <div style={{padding:"12px 16px 0"}}><MediaPreview post={post} onReorder={reorder} editable/></div>
      <div style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
          <span style={tag(STATUS_COLORS[post.status])}>{post.status}</span>
          {perf&&<span style={tag(perf.color)}>{perf.label}</span>}
        </div>
        {post.copy&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:"#bbb",marginBottom:4,fontWeight:600,letterSpacing:"0.5px"}}>CAPTION</div><div style={{fontSize:12,color:"#444",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{post.copy}</div></div>}
        {post.hashtags&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:"#bbb",marginBottom:4,fontWeight:600,letterSpacing:"0.5px"}}>HASHTAGS</div><div style={{fontSize:11,color:b?b.color:NAVY,lineHeight:1.6}}>{post.hashtags}</div></div>}
        {(post.copy||post.hashtags)&&<div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          <button onClick={()=>{navigator.clipboard.writeText([post.copy,post.hashtags].filter(Boolean).join("\n\n"));notify("Copiado");}} style={{...s.btn,fontSize:10,padding:"4px 10px"}}>Copiar todo</button>
          {post.copy&&<button onClick={()=>{navigator.clipboard.writeText(post.copy);notify("Copy copiado");}} style={{...s.btn,fontSize:10,padding:"4px 10px"}}>Solo copy</button>}
          {post.hashtags&&<button onClick={()=>{navigator.clipboard.writeText(post.hashtags);notify("Hashtags copiados");}} style={{...s.btn,fontSize:10,padding:"4px 10px"}}>Solo hashtags</button>}
        </div>}
        <div><div style={{fontSize:10,color:"#bbb",marginBottom:6,fontWeight:600,letterSpacing:"0.5px"}}>CÓMO FUNCIONÓ</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{PERFORMANCE.map(p=><button key={p.value} onClick={()=>setPerf(post.id,p.value)} style={{...s.btn,fontSize:10,padding:"4px 10px",background:post.performance===p.value?p.bg:"#fafaf9",color:post.performance===p.value?p.color:"#aaa",borderColor:post.performance===p.value?p.color+"44":"#eee",fontWeight:post.performance===p.value?600:400}}>{p.label}</button>)}</div>
        </div>
      </div>
      <div style={{padding:"8px 16px",borderTop:"1px solid #eee",display:"flex",justifyContent:"flex-end"}}><button onClick={()=>openPost(post)} style={{...s.btn,fontSize:10,padding:"4px 10px"}}>Editar</button></div>
    </div>;
  };

  // ── Home ───────────────────────────────────────────────────────────────────
  const renderHome=()=>{
    const todayStr=today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0")+"-"+String(today.getDate()).padStart(2,"0");
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#2c2c2a",marginBottom:4}}>Bienvenida 👋</div>
        <div style={{fontSize:13,color:"#999"}}>Selecciona una marca para empezar o revisa tus tareas pendientes.</div>
      </div>

      <div style={{fontSize:10,color:"#999",fontWeight:700,letterSpacing:"0.8px",marginBottom:12}}>MIS MARCAS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:28}}>
        {brands.map(b=>{
          const count=brandPosts(b.id).filter(p=>{const dt=new Date(p.date);return dt>=new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay()+1)&&dt<=new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay()+7);}).length;
          const mToday=brandPosts(b.id).filter(p=>p.status==="Subir manual"&&p.date===todayStr).length;
          return <div key={b.id} onClick={()=>{setActiveBrand(b);setViewStack([]);setView("brand");setShowMonthPosts(false);}}
            style={{background:"#fff",borderRadius:12,padding:"14px",cursor:"pointer",border:"1px solid #e4e6de",borderTop:"3px solid "+b.color}}>
            <div style={{width:32,height:32,borderRadius:8,background:b.color+"18",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,fontWeight:700,fontSize:13,color:b.color}}>{b.name[0]}</div>
            <div style={{fontWeight:600,fontSize:13,marginBottom:3,color:"#2c2c2a"}}>{b.name}</div>
            <div style={{fontSize:11,color:"#aaa"}}>{count} posts esta semana</div>
            {mToday>0&&<div style={{fontSize:11,color:"#E8A838",marginTop:4,fontWeight:500}}>⚠ {mToday} manual hoy</div>}
          </div>;
        })}
        <div onClick={()=>{setActiveBrand(null);setBrandForm({name:"",color:NAVY,colorSecondary:"#e8eaf2",logo:null});goTo("newBrand");}} style={{background:"#fff",borderRadius:12,padding:"14px",cursor:"pointer",border:"1.5px dashed #dde0d5",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,minHeight:100}}>
          <div style={{fontSize:22,color:"#ccc"}}>+</div>
          <div style={{fontSize:12,color:"#bbb"}}>Nueva marca</div>
        </div>
      </div>

      <div style={{fontSize:10,color:"#999",fontWeight:700,letterSpacing:"0.8px",marginBottom:12}}>CALENDARIO GLOBAL</div>
      {renderCalendar(null)}

      <div style={{marginTop:20}}>{renderTodo()}</div>
    </div>;
  };

  // ── Brand ──────────────────────────────────────────────────────────────────
  const renderBrand=()=>{
    const manual=brandPosts(activeBrand.id).filter(p=>{const d=new Date(p.date+"T"+p.hour);return p.status==="Subir manual"&&d>=new Date();}).sort((a,b)=>new Date(a.date+"T"+a.hour)-new Date(b.date+"T"+b.hour));
    return <div style={{padding:"20px 0 40px"}}>
      {/* Brand header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div style={{width:48,height:48,borderRadius:12,background:activeBrand.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,color:activeBrand.color}}>{activeBrand.name[0]}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#2c2c2a"}}>{activeBrand.name}</div>
      </div>
      {manual.length>0&&<div style={{background:"#FFF8EC",border:"1px solid #F0D080",borderRadius:10,padding:"10px 16px",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:10,color:"#B8860B",marginBottom:6,letterSpacing:"0.5px"}}>SUBIR MANUAL</div>
        {manual.slice(0,3).map(p=><div key={p.id} onClick={()=>openPost(p)} style={{fontSize:12,marginBottom:3,cursor:"pointer",color:"#555"}}>{p.date} {p.hour} — <strong>{p.title}</strong></div>)}
      </div>}

      {/* Two-column layout: calendar + feed */}
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",gap:12}}>
          {renderCalendar(activeBrand.id)}
          {!showMonthPosts
            ?<button onClick={()=>setShowMonthPosts(true)} style={{...s.btnP,width:"100%",padding:"12px",fontSize:13,borderRadius:10}}>Ver publicaciones de {MONTHS[calMonth]}</button>
            :<div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#2c2c2a"}}>Publicaciones de {MONTHS[calMonth]}</div>
                <button onClick={()=>setShowMonthPosts(false)} style={{...s.btn,fontSize:11}}>Ocultar</button>
              </div>
              {postsInMonth(calYear,calMonth,activeBrand.id).length===0
                ?<div style={{color:"#bbb",fontSize:13,fontStyle:"italic"}}>No hay publicaciones.</div>
                :<div style={{display:"grid",gap:14}}>{postsInMonth(calYear,calMonth,activeBrand.id).map(p=><PostCard key={p.id} post={p}/>)}</div>}
            </div>}
        </div>
        {renderFeedGrid()}
      </div>
    </div>;
  };

  // ── Feed Grid (Instagram-style 3x4) ────────────────────────────────────────
  const renderFeedGrid=()=>{
    const fp=activeBrand?brandPosts(activeBrand.id).filter(p=>{const nets=Array.isArray(p.network)?p.network:[p.network];return nets.includes("Instagram");}).sort((a,b)=>new Date(a.date)-new Date(b.date)):[];
    const cells=fp.slice(0,12);
    while(cells.length<12) cells.push(null);
    return <div style={{background:"#fff",borderRadius:14,border:"1px solid #e4e6de",padding:"16px",width:220,flexShrink:0}}>
      <div style={{fontSize:13,fontWeight:600,color:"#2c2c2a",marginBottom:12}}>Preview del feed</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
        {cells.map((p,i)=>{
          const thumb=p&&(p.carouselFiles&&p.carouselFiles[0]?p.carouselFiles[0]:p.fileUrl);
          const tc=p?(p.contentKind==="collab"?COLLAB_COLOR:(TYPE_COLORS[p.type]||{bg:"#f3f4f6",text:"#374151"})):null;
          return <div key={i} onClick={()=>p&&openPost(p)} style={{aspectRatio:"4/5",borderRadius:5,overflow:"hidden",cursor:p?"pointer":"default",background:p?tc.bg:"#f0f0eb",position:"relative"}}>
            {thumb&&<img src={thumb} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>}
            {p&&!thumb&&<div style={{width:"100%",height:"100%",display:"flex",alignItems:"flex-end",padding:"4px"}}>
              <span style={{fontSize:8,fontWeight:600,color:tc.text,background:"rgba(255,255,255,0.7)",borderRadius:3,padding:"1px 4px"}}>{p.contentKind==="collab"?"Collab":p.type}</span>
            </div>}
          </div>;
        })}
      </div>
    </div>;
  };

  // ── Feed page ───────────────────────────────────────────────────────────────
  const renderFeed=()=>{
    const fp=brandPosts(activeBrand.id).filter(p=>{const nets=Array.isArray(p.network)?p.network:[p.network];return nets.includes("Instagram");}).sort((a,b)=>new Date(a.date)-new Date(b.date));
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a",marginBottom:4}}>Preview feed</div>
      <div style={{fontSize:11,color:"#bbb",marginBottom:20}}>Instagram · {activeBrand.name}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,borderRadius:10,overflow:"hidden"}}>
        {fp.length===0&&<div style={{color:"#bbb",fontSize:12,gridColumn:"1/-1",padding:20,fontStyle:"italic"}}>No hay posts de Instagram todavía.</div>}
        {fp.map(p=><div key={p.id} onClick={()=>openPost(p)} style={{aspectRatio:"1",background:"#eee",overflow:"hidden",cursor:"pointer"}}>
          {(p.fileUrl||(p.carouselFiles&&p.carouselFiles[0]))
            ?<img src={(p.carouselFiles&&p.carouselFiles[0])||p.fileUrl} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={p.title}/>
            :<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:"#f0ede8"}}><div style={{fontSize:10,color:"#bbb"}}>{p.type}</div><div style={{fontSize:10,fontWeight:500,textAlign:"center",padding:"0 4px",color:"#888"}}>{p.title}</div></div>}
        </div>)}
      </div>
    </div>;
  };

  // ── Post form ──────────────────────────────────────────────────────────────
  const renderPostView=()=>{
    const isC=form.type==="Carrusel",isV=form.type==="Reel",isI=form.type==="Historia"||form.type==="Post estático";
    const prev={...form,carouselFiles:form.carouselFiles||[]};
    const hasMedia=(isC&&form.carouselFiles&&form.carouselFiles.length>0)||(isV&&form.fileUrl)||(isI&&form.fileUrl);
    return <div style={{maxWidth:540,margin:"0 auto",padding:"24px 0 40px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a",marginBottom:2}}>{activePost?"Editar publicación":"Nueva publicación"}</div>
        {activeBrand&&<div style={{fontSize:12,color:"#aaa"}}>{activeBrand.name}</div>}
      </div>
      <div style={{display:"grid",gap:14}}>
        {hasMedia&&<div><div style={{fontSize:10,color:"#bbb",marginBottom:8,fontWeight:600,letterSpacing:"0.5px"}}>PREVIEW</div><MediaPreview post={prev} onReorder={nf=>setForm(f=>({...f,carouselFiles:nf}))} editable/></div>}
        <div><label style={s.label}>Marca</label><select value={form.brandId||""} onChange={e=>setForm(f=>({...f,brandId:+e.target.value}))} style={s.input}>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        <div><label style={s.label}>Título</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Ej: Reel gilda" style={s.input}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={s.label}>Tipo</label><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value,fileUrl:null,fileName:null,carouselFiles:[]}))} style={s.input}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><label style={s.label}>Fecha</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={s.input}/></div>
            <div><label style={s.label}>Hora</label><input type="time" value={form.hour} onChange={e=>setForm(f=>({...f,hour:e.target.value}))} style={s.input}/></div>
          </div>
        </div>
        <div><label style={s.label}>Redes sociales</label><NetworkPicker value={form.network} onChange={v=>setForm(f=>({...f,network:v}))}/></div>
        <div><label style={s.label}>Estado</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={s.input}>{STATUSES.map(st=><option key={st}>{st}</option>)}</select></div>
        <div><label style={s.label}>Campaña</label><select value={form.campaignId||""} onChange={e=>setForm(f=>({...f,campaignId:e.target.value?+e.target.value:null}))} style={s.input}><option value="">Sin campaña</option>{campaigns.filter(c=>!form.brandId||!c.brandIds||c.brandIds.length===0||c.brandIds.includes(form.brandId)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label style={s.label}>Tipo de contenido</label>
          <div style={{display:"flex",gap:8}}>
            {[["own","✍️  Contenido propio"],["collab","🤝  Colaboración"]].map(([v,l])=>
              <button key={v} type="button" onClick={()=>setForm(f=>({...f,contentKind:v,influencerName:""}))}
                style={{...s.btn,flex:1,background:form.contentKind===v?theme.accent:"#fafaf9",borderColor:form.contentKind===v?theme.primary+"55":"#eee",color:form.contentKind===v?theme.primary:"#888",fontWeight:form.contentKind===v?600:400}}>
                {l}
              </button>
            )}
          </div>
        </div>
        {form.contentKind==="collab"&&<div><label style={s.label}>Influencer</label><input value={form.influencerName} onChange={e=>setForm(f=>({...f,influencerName:e.target.value}))} placeholder="@nombre" style={s.input}/></div>}
        {isC&&<div><label style={s.label}>Imágenes del carrusel</label>
          <label style={{display:"block",padding:"14px",borderRadius:8,border:"1.5px dashed #dde0d5",textAlign:"center",cursor:"pointer",background:"#fafaf9",marginBottom:8}}>
            <div style={{fontSize:12,color:"#bbb"}}>Tocá para subir imágenes</div>
            <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleCarouselUpload}/>
          </label>
          {form.carouselFiles&&form.carouselFiles.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {form.carouselFiles.map((f,i)=><div key={i} draggable onDragStart={()=>setForm(fm=>({...fm,_drag:i}))} onDragOver={e=>e.preventDefault()} onDrop={()=>{const fr=form._drag;if(fr===i)return;const a=[...form.carouselFiles];const[it]=a.splice(fr,1);a.splice(i,0,it);setForm(fm=>({...fm,carouselFiles:a,_drag:null}));}} style={{position:"relative",width:52,height:52,borderRadius:5,overflow:"hidden",cursor:"grab",border:"1px solid #eee",flexShrink:0}}>
              <img src={f} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
              <button onClick={()=>setForm(fm=>({...fm,carouselFiles:fm.carouselFiles.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:1,right:1,width:14,height:14,borderRadius:"50%",background:"rgba(0,0,0,0.55)",color:"#fff",border:"none",cursor:"pointer",fontSize:9,lineHeight:"14px",textAlign:"center",padding:0}}>×</button>
            </div>)}
          </div>}
        </div>}
        {(isV||isI)&&<div><label style={s.label}>{isV?"Video":"Imagen"}</label>
          {form.fileUrl
            ?<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:"#fafaf9",border:"1px solid #eee"}}><span style={{fontSize:12,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#666"}}>{form.fileName}</span><button onClick={()=>setForm(f=>({...f,fileUrl:null,fileName:null}))} style={{...s.btn,fontSize:10,padding:"3px 8px",color:"#C73E1D"}}>Quitar</button></div>
            :<label style={{display:"block",padding:"18px",borderRadius:8,border:"1.5px dashed #dde0d5",textAlign:"center",cursor:"pointer",background:"#fafaf9"}}><div style={{fontSize:12,color:"#bbb"}}>{isV?"Subí el video":"Subí la imagen"}</div><input type="file" accept={isV?"video/*":"image/*"} style={{display:"none"}} onChange={handleFileUpload}/></label>}
        </div>}
        <div><label style={s.label}>Copy / Caption</label><textarea value={form.copy} onChange={e=>setForm(f=>({...f,copy:e.target.value}))} rows={5} placeholder="Escribí el copy del post..." style={{...s.input,resize:"vertical",lineHeight:1.6}}/></div>
        <div><label style={s.label}>Hashtags</label><input value={form.hashtags} onChange={e=>setForm(f=>({...f,hashtags:e.target.value}))} placeholder="#hashtag1 #hashtag2..." style={s.input}/></div>
        <div style={{display:"flex",gap:8,paddingTop:4}}>
          <button onClick={savePost} style={{...s.btnP,flex:1}}>{activePost?"Guardar cambios":"Crear publicación"}</button>
          {activePost&&<button onClick={()=>deletePost(activePost.id)} style={{...s.btn,color:"#C73E1D",borderColor:"#f0ccc8"}}>Eliminar</button>}
        </div>
      </div>
    </div>;
  };

  // ── Brand form ─────────────────────────────────────────────────────────────
  const renderBrandForm=(isEdit)=><div style={{maxWidth:460,margin:"0 auto",padding:"24px 0 40px"}}>
    <div style={{marginBottom:24}}><div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>{isEdit?"Configurar marca":"Nueva marca"}</div></div>
    <div style={{display:"grid",gap:14}}>
      {brandForm.logo&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:"#fafaf9",borderRadius:8,border:"1px solid #eee"}}><img src={brandForm.logo} style={{height:32,maxWidth:100,objectFit:"contain"}} alt="logo"/><button onClick={()=>setBrandForm(f=>({...f,logo:null}))} style={{...s.btn,fontSize:10,padding:"3px 8px",color:"#C73E1D"}}>Quitar</button></div>}
      <div><label style={s.label}>Logo (PNG)</label><label style={{display:"block",padding:"12px",borderRadius:8,border:"1.5px dashed #dde0d5",textAlign:"center",cursor:"pointer",background:"#fafaf9"}}><div style={{fontSize:12,color:"#bbb"}}>Subir logo PNG</div><input type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoUpload}/></label></div>
      <div><label style={s.label}>Nombre</label><input value={brandForm.name} onChange={e=>setBrandForm(f=>({...f,name:e.target.value}))} placeholder="Ej: Wine & Tapas" style={s.input}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={s.label}>Color primario</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="color" value={brandForm.color} onChange={e=>setBrandForm(f=>({...f,color:e.target.value}))} style={{width:36,height:36,borderRadius:6,border:"1px solid #eee",cursor:"pointer",padding:2}}/>
            <input value={brandForm.color} onChange={e=>setBrandForm(f=>({...f,color:e.target.value}))} style={{...s.input,flex:1}} placeholder="#34456c"/>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>{PRESET_COLORS.map(c=><div key={c} onClick={()=>setBrandForm(f=>({...f,color:c}))} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:brandForm.color===c?"2px solid #333":"2px solid transparent"}}/>)}</div>
        </div>
        <div><label style={s.label}>Color secundario</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="color" value={brandForm.colorSecondary||"#e8eaf2"} onChange={e=>setBrandForm(f=>({...f,colorSecondary:e.target.value}))} style={{width:36,height:36,borderRadius:6,border:"1px solid #eee",cursor:"pointer",padding:2}}/>
            <input value={brandForm.colorSecondary||""} onChange={e=>setBrandForm(f=>({...f,colorSecondary:e.target.value}))} style={{...s.input,flex:1}} placeholder="#e8eaf2"/>
          </div>
        </div>
      </div>
      <button onClick={saveBrand} style={{...s.btnP,background:brandForm.color}}>{isEdit?"Guardar cambios":"Crear marca"}</button>
    </div>
  </div>;

  // ── Metrics ────────────────────────────────────────────────────────────────
  const renderMetrics=()=>{
    const bm=metrics.filter(m=>m.brandId===activeBrand.id).sort((a,b)=>a.year!==b.year?a.year-b.year:a.month-b.month);
    const latest=bm[bm.length-1];const prev=bm[bm.length-2];
    const activeOpt=METRIC_OPTS.find(o=>o[0]===activeMetric);
    const pct=k=>{if(!latest||!prev||!prev[k])return null;return((+(latest[k])-+(prev[k]))/(+(prev[k])||1)*100).toFixed(1);};
    const collabs=collabPostsFn(activeBrand.id);
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div><div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>Métricas</div><div style={{fontSize:11,color:"#aaa",marginTop:2}}>{activeBrand.name}</div></div>
        <button onClick={()=>notify("Generando PDF...")} style={{...s.btn,fontSize:11,borderColor:theme.primary+"44",color:theme.primary}}>Exportar PDF</button>
      </div>
      {bm.length>0&&<div style={{marginBottom:32}}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:14}}>ÚLTIMO MES — {MONTHS[latest.month]} {latest.year}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
          {METRIC_OPTS.map(([k,lbl,col])=>{const delta=pct(k);return <div key={k} onClick={()=>setActiveMetric(k)} style={{background:activeMetric===k?"#fff":BG,borderRadius:10,padding:"12px 14px",cursor:"pointer",border:activeMetric===k?"1.5px solid "+col+"44":"1px solid #e4e6de"}}>
            <div style={{fontSize:10,color:"#aaa",marginBottom:6,fontWeight:500}}>{lbl}</div>
            <div style={{fontSize:17,fontWeight:700,color:activeMetric===k?col:"#2c2c2a"}}>{(+(latest[k])||0).toLocaleString()}</div>
            {delta!==null&&<div style={{fontSize:9,marginTop:3,color:+delta>=0?"#5BAD8F":"#C73E1D",fontWeight:600}}>{+delta>=0?"↑":"↓"} {Math.abs(delta)}%</div>}
          </div>;})}
        </div>
        {bm.length>=2&&<div style={{...s.card,marginBottom:16}}><div style={{fontSize:11,fontWeight:700,marginBottom:10,color:activeOpt[2],letterSpacing:"0.3px"}}>{activeOpt[1].toUpperCase()}</div><MiniChart data={bm} metric={activeMetric} color={activeOpt[2]}/></div>}
        <div style={{...s.card,marginBottom:20}}>
          <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:12}}>COMPARATIVA</div>
          {METRIC_OPTS.map(([k,lbl,col])=>{const mx=Math.max(...bm.map(m=>+(m[k])||0))||1;const pw=Math.round(((+(latest[k])||0)/mx)*100);return <div key={k} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#888"}}>{lbl}</span><span style={{fontSize:11,fontWeight:700,color:"#2c2c2a"}}>{(+(latest[k])||0).toLocaleString()}</span></div><div style={{height:4,borderRadius:2,background:"#eee"}}><div style={{height:"100%",borderRadius:2,background:col,width:pw+"%"}}/></div></div>;})}
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:14}}>PUBLICACIONES PRINCIPALES</div>
          <div style={{display:"grid",gap:5,marginBottom:14}}>{brandPosts(activeBrand.id).map(p=>{const isFeat=(featuredPosts[activeBrand.id]||[]).includes(p.id);const thumb=p.carouselFiles&&p.carouselFiles[0]?p.carouselFiles[0]:p.fileUrl;return <div key={p.id} onClick={()=>toggleFeatured(activeBrand.id,p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:isFeat?"1.5px solid "+theme.primary+"44":"1px solid #e4e6de",background:isFeat?theme.accent:BG,cursor:"pointer"}}>
            {thumb?<img src={thumb} style={{width:36,height:36,borderRadius:5,objectFit:"cover",flexShrink:0}} alt="t"/>:<div style={{width:36,height:36,borderRadius:5,background:"#eee",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#ccc"}}>{p.type[0]}</div>}
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div><div style={{fontSize:10,color:"#bbb"}}>{p.date} · {p.type}</div></div>
            <div style={{width:18,height:18,borderRadius:"50%",border:"1.5px solid "+(isFeat?theme.primary:"#ddd"),background:isFeat?theme.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isFeat&&<span style={{color:"#fff",fontSize:9,lineHeight:1}}>✓</span>}</div>
          </div>;})}
          </div>
        </div>
      </div>}
      <div style={{marginBottom:28}}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:14}}>COLABORACIONES ({collabs.length})</div>
        {collabs.length===0?<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>No hay colaboraciones todavía.</div>
        :<div style={{display:"grid",gap:8}}>{collabs.map(p=>{const cm=collabMetrics.find(m=>m.postId===p.id)||{};const hasMet=Object.keys(cm).length>1;const thumb=p.carouselFiles&&p.carouselFiles[0]?p.carouselFiles[0]:p.fileUrl;return <div key={p.id} style={{borderRadius:10,overflow:"hidden",border:"1px solid #e4e6de"}}>
          <div style={{background:"#7B2D8B",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {thumb?<img src={thumb} style={{width:32,height:32,borderRadius:5,objectFit:"cover",flexShrink:0}} alt="t"/>:<div style={{width:32,height:32,borderRadius:5,background:"rgba(255,255,255,0.15)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤝</div>}
              <div><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{p.influencerName||"Sin nombre"}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.65)"}}>{p.title} · {p.date}</div></div>
            </div>
            <button onClick={()=>{setActiveCollab(p);const ex=collabMetrics.find(m=>m.postId===p.id);setCollabMetricsForm(ex?{...ex}:{...emptyCollabM});goTo("collabDetail");}} style={{...s.btn,fontSize:10,padding:"4px 10px"}}>{hasMet?"Ver métricas":"Cargar"}</button>
          </div>
          {hasMet&&<div style={{padding:"8px 14px",background:BG,display:"flex",gap:14,flexWrap:"wrap"}}>
            {COLLAB_FIELDS.slice(0,4).map(([k,lbl,col])=>cm[k]?<div key={k}><div style={{fontSize:9,color:"#bbb"}}>{lbl}</div><div style={{fontSize:13,fontWeight:700,color:col}}>{k==="col_engagement_rate"?cm[k]+"%":(+(cm[k])||0).toLocaleString()}</div></div>:null)}
          </div>}
        </div>;})}
        </div>}
      </div>
      <div style={{...s.card,marginBottom:20}}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:16}}>CARGAR MÉTRICAS MENSUALES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><label style={s.label}>Mes</label><select value={metricsForm.month} onChange={e=>setMetricsForm(f=>({...f,month:+e.target.value}))} style={s.input}>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select></div>
          <div><label style={s.label}>Año</label><input type="number" value={metricsForm.year} onChange={e=>setMetricsForm(f=>({...f,year:+e.target.value}))} style={s.input}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>{METRIC_OPTS.map(([k,lbl])=><div key={k}><label style={s.label}>{lbl}</label><input type="number" value={metricsForm[k]} onChange={e=>setMetricsForm(f=>({...f,[k]:e.target.value}))} placeholder="0" style={s.input}/></div>)}</div>
        <button onClick={saveMetrics} style={s.btnP}>Guardar</button>
      </div>
      {bm.length>0&&<div style={{overflowX:"auto",borderRadius:10,border:"1px solid #e4e6de"}}>
        <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
          <thead><tr style={{background:BG}}>{["Mes",...METRIC_OPTS.map(o=>o[1])].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#aaa",fontWeight:600,borderBottom:"1px solid #e4e6de",whiteSpace:"nowrap",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>{bm.map((m,i)=><tr key={i} style={{borderBottom:"1px solid #eee"}}><td style={{padding:"7px 10px",fontWeight:600,whiteSpace:"nowrap",color:"#555"}}>{MONTHS[m.month].slice(0,3)} {m.year}</td>{METRIC_OPTS.map(([k])=><td key={k} style={{padding:"7px 10px",color:"#666"}}>{(+(m[k])||0).toLocaleString()}</td>)}</tr>)}</tbody>
        </table>
      </div>}
    </div>;
  };

  // ── Collab detail ──────────────────────────────────────────────────────────
  const renderCollabDetail=()=>{
    if(!activeCollab)return null;
    const post=activeCollab;const b=brandById(post.brandId);const cm=collabMetrics.find(m=>m.postId===post.id)||{};const hasSaved=Object.keys(cm).length>1;const thumb=post.carouselFiles&&post.carouselFiles[0]?post.carouselFiles[0]:post.fileUrl;
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{marginBottom:20}}><div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>🤝 {post.influencerName||"Colaboración"}</div><div style={{fontSize:11,color:"#aaa",marginTop:2}}>{post.title} · {post.date}</div></div>
      {hasSaved&&<div style={{marginBottom:24}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:12}}>
          {COLLAB_FIELDS.map(([k,lbl,col])=>cm[k]?<div key={k} style={{...s.card,padding:"10px 12px"}}><div style={{fontSize:9,color:"#bbb",marginBottom:4,fontWeight:700}}>{lbl.toUpperCase()}</div><div style={{fontSize:17,fontWeight:700,color:col}}>{k==="col_engagement_rate"?cm[k]+"%":(+(cm[k])||0).toLocaleString()}</div></div>:null)}
        </div>
        {cm.col_notes&&<div style={{...s.card,marginBottom:16}}><div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:"0.5px",marginBottom:6}}>VALORACIÓN</div><div style={{fontSize:13,lineHeight:1.65,color:"#444",whiteSpace:"pre-wrap"}}>{cm.col_notes}</div></div>}
      </div>}
      <div style={s.card}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:16}}>{hasSaved?"EDITAR MÉTRICAS":"CARGAR MÉTRICAS"}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>{COLLAB_FIELDS.map(([k,lbl])=><div key={k}><label style={s.label}>{lbl}</label><input type="number" value={collabMetricsForm[k]||""} onChange={e=>setCollabMetricsForm(f=>({...f,[k]:e.target.value}))} placeholder="0" style={s.input}/></div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div><label style={s.label}>Código de descuento</label><input value={collabMetricsForm.col_discount_code||""} onChange={e=>setCollabMetricsForm(f=>({...f,col_discount_code:e.target.value}))} placeholder="Ej: 10MARIA" style={s.input}/></div>
          <div><label style={s.label}>Usos del código</label><input type="number" value={collabMetricsForm.col_code_uses||""} onChange={e=>setCollabMetricsForm(f=>({...f,col_code_uses:e.target.value}))} placeholder="0" style={s.input}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={s.label}>Valoración de la colaboración</label><textarea value={collabMetricsForm.col_notes||""} onChange={e=>setCollabMetricsForm(f=>({...f,col_notes:e.target.value}))} rows={4} placeholder="¿Cómo fue? ¿Repetiría?" style={{...s.input,resize:"vertical",lineHeight:1.6}}/></div>
        <button onClick={()=>saveCollabMetrics(post.id)} style={{...s.btnP,background:"#7B2D8B",width:"100%"}}>Guardar métricas</button>
      </div>
    </div>;
  };

  // ── Campaigns ──────────────────────────────────────────────────────────────
  const renderCampaigns=()=>{
    const visibleCampaigns=activeBrand
      ?campaigns.filter(c=>c.brandIds&&c.brandIds.includes(activeBrand.id))
      :campaigns;
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>Campañas</div>
          {activeBrand&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{activeBrand.name}</div>}
        </div>
        <button onClick={()=>{setActiveCampaign(null);setCampaignForm({name:"",color:"#E8A838",dateStart:"",dateEnd:"",description:"",brandIds:activeBrand?[activeBrand.id]:[]});goTo("campaignForm");}} style={s.btnP}>+ Nueva</button>
      </div>
      {visibleCampaigns.length===0&&<div style={{color:"#bbb",fontSize:13,fontStyle:"italic"}}>No hay campañas para esta marca todavía.</div>}
      <div style={{display:"grid",gap:10}}>
        {visibleCampaigns.map(c=>{const cp=posts.filter(p=>p.campaignId===c.id);const cm=campaignMetrics.find(m=>m.campaignId===c.id);return <div key={c.id} style={{borderRadius:12,overflow:"hidden",border:"1px solid #e4e6de"}}>
          <div style={{background:c.color,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"#fff"}}>{c.name}</div>
              {(c.dateStart||c.dateEnd)&&<div style={{fontSize:10,color:"rgba(255,255,255,0.75)",marginTop:2}}>{c.dateStart}{c.dateEnd?" → "+c.dateEnd:""} · {cp.length} posts</div>}
              {c.brandIds&&c.brandIds.length>0&&<div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{c.brandIds.map(bId=>{const b=brandById(bId);return b?<span key={bId} style={{fontSize:9,padding:"1px 6px",borderRadius:10,background:"rgba(255,255,255,0.2)",color:"#fff"}}>{b.name}</span>:null;})}</div>}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setActiveCampaign(c);setCampaignForm({...c,brandIds:c.brandIds||[]});goTo("campaignForm");}} style={{...s.btn,fontSize:10,padding:"4px 9px"}}>Editar</button>
              <button onClick={()=>{setActiveCampaign(c);goTo("campaignDetail");}} style={{...s.btn,fontSize:10,padding:"4px 9px"}}>Ver</button>
            </div>
          </div>
          <div style={{padding:"10px 16px",background:BG,display:"flex",gap:20,flexWrap:"wrap"}}>
            <div><div style={{fontSize:9,color:"#bbb",fontWeight:700}}>POSTS</div><div style={{fontSize:15,fontWeight:700,color:"#2c2c2a"}}>{cp.length}</div></div>
            {cm&&cm.camp_reach&&<div><div style={{fontSize:9,color:"#bbb",fontWeight:700}}>ALCANCE</div><div style={{fontSize:15,fontWeight:700,color:"#2E86AB"}}>{(+(cm.camp_reach)||0).toLocaleString()}</div></div>}
          </div>
        </div>;})}
      </div>
    </div>;
  };

  const renderCampaignForm=()=>{
    const toggleBrand=id=>setCampaignForm(f=>({...f,brandIds:f.brandIds.includes(id)?f.brandIds.filter(x=>x!==id):[...f.brandIds,id]}));
    return <div style={{maxWidth:480,margin:"0 auto",padding:"24px 0 40px"}}>
      <div style={{marginBottom:24}}><div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>{activeCampaign?"Editar campaña":"Nueva campaña"}</div></div>
      <div style={{display:"grid",gap:14}}>
        <div><label style={s.label}>Nombre</label><input value={campaignForm.name} onChange={e=>setCampaignForm(f=>({...f,name:e.target.value}))} placeholder="Ej: San Valentín 2026" style={s.input}/></div>
        <div><label style={s.label}>Marcas participantes</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {brands.map(b=>{
              const active=campaignForm.brandIds&&campaignForm.brandIds.includes(b.id);
              return <button key={b.id} type="button" onClick={()=>toggleBrand(b.id)}
                style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid "+(active?b.color:"#dde0d5"),background:active?b.color+"18":"#fafaf9",color:active?b.color:"#888",fontSize:12,cursor:"pointer",fontWeight:active?600:400}}>
                {b.name}
              </button>;
            })}
          </div>
          {(!campaignForm.brandIds||campaignForm.brandIds.length===0)&&<div style={{fontSize:11,color:"#E8A838",marginTop:6}}>Seleccioná al menos una marca</div>}
        </div>
        <div><label style={s.label}>Color</label>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <input type="color" value={campaignForm.color} onChange={e=>setCampaignForm(f=>({...f,color:e.target.value}))} style={{width:36,height:36,borderRadius:6,border:"1px solid #eee",cursor:"pointer",padding:2}}/>
            <input value={campaignForm.color} onChange={e=>setCampaignForm(f=>({...f,color:e.target.value}))} style={{...s.input,flex:1}}/>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{PRESET_COLORS.map(c=><div key={c} onClick={()=>setCampaignForm(f=>({...f,color:c}))} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",border:campaignForm.color===c?"2px solid #333":"2px solid transparent"}}/>)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={s.label}>Fecha inicio</label><input type="date" value={campaignForm.dateStart} onChange={e=>setCampaignForm(f=>({...f,dateStart:e.target.value}))} style={s.input}/></div>
          <div><label style={s.label}>Fecha fin</label><input type="date" value={campaignForm.dateEnd} onChange={e=>setCampaignForm(f=>({...f,dateEnd:e.target.value}))} style={s.input}/></div>
        </div>
        <div><label style={s.label}>Descripción</label><textarea value={campaignForm.description} onChange={e=>setCampaignForm(f=>({...f,description:e.target.value}))} rows={3} style={{...s.input,resize:"vertical"}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={saveCampaign} style={{...s.btnP,background:campaignForm.color,flex:1}}>{activeCampaign?"Guardar cambios":"Crear campaña"}</button>
          {activeCampaign&&<button onClick={()=>deleteCampaign(activeCampaign.id)} style={{...s.btn,color:"#C73E1D",borderColor:"#f0ccc8"}}>Eliminar</button>}
        </div>
      </div>
    </div>;
  };

  const renderCampaignDetail=()=>{
    if(!activeCampaign)return null;
    const cp=posts.filter(p=>p.campaignId===activeCampaign.id);const cm=campaignMetrics.find(m=>m.campaignId===activeCampaign.id)||{};const starPost=cm.camp_star_post?posts.find(p=>p.id===cm.camp_star_post):null;const hasSaved=Object.keys(cm).length>1;
    return <div style={{padding:"24px 0 40px"}}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{width:10,height:10,borderRadius:"50%",background:activeCampaign.color}}/><div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#2c2c2a"}}>{activeCampaign.name}</div></div>
        <div style={{fontSize:11,color:"#aaa"}}>{activeCampaign.dateStart||""}{activeCampaign.dateEnd?" → "+activeCampaign.dateEnd:""}</div>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:10}}>POSTS ASIGNADOS</div>
        {cp.length===0?<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>No hay posts asignados todavía.</div>
        :<div style={{display:"grid",gap:6}}>{cp.map(p=>{const b=brandById(p.brandId);const thumb=p.carouselFiles&&p.carouselFiles[0]?p.carouselFiles[0]:p.fileUrl;return <div key={p.id} onClick={()=>openPost(p)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:"#fff",border:"1px solid #e4e6de",cursor:"pointer"}}>
          {thumb?<img src={thumb} style={{width:32,height:32,borderRadius:5,objectFit:"cover",flexShrink:0}} alt="t"/>:<div style={{width:32,height:32,borderRadius:5,background:"#eee",flexShrink:0}}/>}
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.contentKind==="collab"&&"🤝 "}{p.title}</div><div style={{fontSize:10,color:"#bbb"}}>{b?b.name:""} · {p.date}</div></div>
          <span style={tag(STATUS_COLORS[p.status])}>{p.status}</span>
        </div>;})}
        </div>}
      </div>
      {hasSaved&&<div style={{marginBottom:24}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:8,marginBottom:12}}>
          {CAMPAIGN_METRIC_FIELDS.map(([k,lbl,col])=>cm[k]?<div key={k} style={{...s.card,padding:"10px 12px"}}><div style={{fontSize:9,color:"#bbb",marginBottom:4,fontWeight:700}}>{lbl.toUpperCase()}</div><div style={{fontSize:17,fontWeight:700,color:col}}>{k==="camp_engagement_rate"?cm[k]+"%":(+(cm[k])||0).toLocaleString()}</div></div>:null)}
        </div>
        {cm.camp_notes&&<div style={s.card}><div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:"0.5px",marginBottom:6}}>CONCLUSIONES</div><div style={{fontSize:13,lineHeight:1.65,color:"#444",whiteSpace:"pre-wrap"}}>{cm.camp_notes}</div></div>}
      </div>}
      <div style={s.card}>
        <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:"0.8px",marginBottom:16}}>{hasSaved?"EDITAR MÉTRICAS":"CARGAR MÉTRICAS"}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>{CAMPAIGN_METRIC_FIELDS.map(([k,lbl])=><div key={k}><label style={s.label}>{lbl}</label><input type="number" value={campaignMetricsForm[k]||""} onChange={e=>setCampaignMetricsForm(f=>({...f,[k]:e.target.value}))} placeholder="0" style={s.input}/></div>)}</div>
        <div style={{marginBottom:14}}><label style={s.label}>Publicación estrella</label>
          {cp.length===0?<div style={{fontSize:12,color:"#bbb",fontStyle:"italic"}}>Asigná posts primero.</div>
          :<div style={{display:"grid",gap:5}}>{cp.map(p=>{const isStar=campaignMetricsForm.camp_star_post===p.id;const thumb=p.carouselFiles&&p.carouselFiles[0]?p.carouselFiles[0]:p.fileUrl;return <div key={p.id} onClick={()=>setCampaignMetricsForm(f=>({...f,camp_star_post:isStar?null:p.id}))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",borderRadius:8,border:isStar?"1.5px solid "+activeCampaign.color:"1px solid #e4e6de",background:isStar?activeCampaign.color+"10":"#fff",cursor:"pointer"}}>
            {thumb?<img src={thumb} style={{width:30,height:30,borderRadius:5,objectFit:"cover",flexShrink:0}} alt="t"/>:<div style={{width:30,height:30,borderRadius:5,background:"#eee",flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0,fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
            <span style={{fontSize:14}}>{isStar?"⭐":"☆"}</span>
          </div>;})}
          </div>}
        </div>
        <div style={{marginBottom:14}}><label style={s.label}>Conclusiones y notas</label><textarea value={campaignMetricsForm.camp_notes||""} onChange={e=>setCampaignMetricsForm(f=>({...f,camp_notes:e.target.value}))} rows={4} style={{...s.input,resize:"vertical",lineHeight:1.6}}/></div>
        <button onClick={saveCampaignMetricsFn} style={{...s.btnP,background:activeCampaign.color,width:"100%"}}>Guardar métricas</button>
      </div>
    </div>;
  };

  return <div style={{minHeight:"100vh",background:BG,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:"#2c2c2a"}}>
    {renderTopbar()}
    <div style={{maxWidth:700,margin:"0 auto",padding:"0 20px"}}>
      {showTodoModal&&renderTodoModal&&renderTodoModal()}
      {notification&&<div style={{position:"fixed",top:60,right:16,padding:"10px 16px",borderRadius:8,background:notification.t==="error"?"#fff0ee":"#f0fdf9",color:notification.t==="error"?"#C73E1D":"#5BAD8F",fontSize:12,fontWeight:600,zIndex:200,border:"1px solid "+(notification.t==="error"?"#f0ccc8":"#b6e8d8"),boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>{notification.msg}</div>}
      {view==="home"&&renderHome()}
      {view==="brand"&&activeBrand&&renderBrand()}
      {view==="feed"&&activeBrand&&renderFeed()}
      {view==="metrics"&&activeBrand&&renderMetrics()}
      {view==="newBrand"&&renderBrandForm(false)}
      {view==="editBrand"&&renderBrandForm(true)}
      {view==="post"&&renderPostView()}
      {view==="campaigns"&&renderCampaigns()}
      {view==="campaignForm"&&renderCampaignForm()}
      {view==="campaignDetail"&&activeCampaign&&renderCampaignDetail()}
      {view==="collabDetail"&&activeCollab&&renderCollabDetail()}
    </div>
  </div>;
}