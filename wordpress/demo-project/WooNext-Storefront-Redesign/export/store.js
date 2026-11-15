/* WooNext demo store — local prototype data & state. Shapes mirror WooCommerce REST (products, variations, cart items, orders) so a real API can replace this module. */
(function(){
if(window.WN) return;
const IDS={0:'1515886657613-9f3515b0c78f',2:'1509631179647-0177331693ae',3:'1483985988355-763728e1935b',7:'1521572163474-6864f9cf17ab',10:'1496747611176-843222e1e57c',12:'1485968579580-b6d095142e6e',15:'1488161628813-04466f872be2',16:'1617137968427-85924c800a22',17:'1503944583220-79d8926ad5e2',18:'1519238263530-99bdd11df2ea',19:'1514090458221-65bb69cf63e6',20:'1556905055-8f358a7a47b2',21:'1576566588028-4147f3842f27',22:'1551028719-00167b16eac5',23:'1591047139829-d91aecb6caea',25:'1595950653106-6c9ebd614d3a',26:'1572635196237-14b3f281503f',27:'1511499767150-a48a237f0083',28:'1553062407-98eeb64c6a62',29:'1584917865442-de89df76afd3',30:'1521369909029-2afed882baee',31:'1556228453-efd6c1ff04f6',32:'1513694203232-719a280e022f',33:'1524758631624-e2822e304c36',35:'1529139574466-a303027c1d8b',36:'1539109136881-3be0616acf4b',38:'1487222477894-8943e31ef7b2',40:'1617127365659-c47fa864d8bc',41:'1581044777550-4cfa60707c03',42:'1564584217132-2271feaeb3c5',43:'1618354691373-d851c5c3a990',44:'1620799140408-edc6dcb6d633',45:'1594633312681-425c7b97ccd1',46:'1586790170083-2f9ceadc732d',47:'1588850561407-ed78c282e89b',49:'1522771930-78848d9293e8',51:'1586023492125-27b2c045efd7',52:'1493663284031-b7e3aefcae8e',55:'1520367445093-50dc08a59d9d',61:'1500917293891-ef795e70e1f6',62:'1517841905240-472988babdf9',65:'1531123897727-8f129e1688ce',69:'1622470953794-aa9c70b0fb9d',70:'1585487000160-6ebcfceb0d03',71:'1622519407650-3df9883f76a5',72:'1475180098004-ca77a66827be',74:'1617922001439-4a2e6562f328',75:'1520975954732-35dd22299614',77:'1594938298603-c8148c4dae35',79:'1611312449408-fcece27cdbb7',81:'1529374255404-311a2a4f1fd9',85:'1600185365483-26d7a4cc7519',86:'1525966222134-fcfa99b8ae77',87:'1560769629-975ec94e6a86',89:'1598300042247-d088f8ab3a91',92:'1578587018452-892bacefd3f2',93:'1592878904946-b3cd8ae243d0',94:'1503919545889-aef636e10ad4',96:'1489987707025-afc232f7ea0f',97:'1535632066927-ab7c9ab60908',98:'1566174053879-31528523f8ae'};
const img=(k,w)=>(window.__resources&&window.__resources['img'+k])||`https://images.unsplash.com/photo-${IDS[k]}?w=800&q=60&auto=format&fit=crop`;
const fmt=n=>(Math.round(n*100)/100).toFixed(2).replace('.',',')+' €';
const SZ=['XS','S','M','L','XL'],KSZ=['4Y','6Y','8Y','10Y'],SHOE=['38','39','40','41','42','43','44'];
const SWATCH={Rust:'bg-rust',Teal:'bg-teal',Navy:'bg-navy',Cream:'bg-cream',Black:'bg-neutral-900',Denim:'bg-sky-700',Orange:'bg-ember',Pink:'bg-pink-300',Brown:'bg-amber-800',Grey:'bg-neutral-400',White:'bg-white',Burgundy:'bg-rose-900',Green:'bg-emerald-700',Red:'bg-red-600',Yellow:'bg-yellow-400'};
const CATS=[
 {slug:'women',label:'Women',kicker:'Women’s wear',title:'Bold by Nature',img:2,img2:35,blurb:'Silk blouses, wide-leg trousers and knits cut for big entrances — warm colour, cool attitude.',subs:['Tops','Dresses','Knitwear','Outerwear','Trousers','Sets']},
 {slug:'men',label:'Men',kicker:'Men’s wear',title:'Retro Tailored',img:38,img2:75,blurb:'Leather, denim and sharp tailoring with a seventies swagger. Built for everyday wear.',subs:['T-Shirts','Jackets','Tailoring']},
 {slug:'kids',label:'Kids',kicker:'Kid’s wear',title:'Little Legends',img:17,img2:94,blurb:'Playground-proof pieces in bright, washable fabrics — easy on, easy off, easy to love.',subs:['Outerwear','Shirts','Sets','Baby']},
 {slug:'accessories',label:'Accessories',kicker:'Finishing touches',title:'The Details',img:29,img2:26,blurb:'Shades, bags, headwear and footwear that finish the look — plus digital releases from the WooNext label.',subs:['Eyewear','Bags','Headwear','Jewellery','Footwear','Digital']},
 {slug:'home-living',label:'Home & Living',kicker:'Home & living',title:'Lounge in Colour',img:31,img2:51,blurb:'Statement chairs, soft sofas and wall pieces that bring the WooNext palette home.',subs:['Decor','Furniture']},
 {slug:'new',label:'New Arrivals',kicker:'Just landed',title:'See What’s New',img:0,img2:92,blurb:'The latest drops, fresh off the rail. New pieces arrive every week.',subs:[]},
 {slug:'offers',label:'Offers',kicker:'Limited time',title:'Flat Out Deals',img:3,img2:40,blurb:'Marked-down favourites while stock lasts. Sale prices shown at checkout — no code needed.',subs:[]}
];
const P=[
 {slug:'wordpress-pennant',name:'WordPress Pennant',cat:'home-living',sub:'Decor',price:11.05,imgs:[31,33],colors:['Cream'],pop:62},
 {slug:'v-neck-t-shirt',name:'V-Neck T-Shirt',cat:'men',sub:'T-Shirts',price:15,priceBySize:{L:20,XL:20},imgs:[7,46],sizes:['S','M','L','XL'],colors:['White','Navy','Rust'],outCombos:['XL|Rust'],pop:88},
 {slug:'t-shirt-with-logo',name:'T-Shirt with Logo',cat:'men',sub:'T-Shirts',price:18,imgs:[21,43],sizes:['S','M','L','XL'],colors:['White','Black'],pop:74},
 {slug:'t-shirt',name:'T-Shirt',cat:'women',sub:'Tops',price:18,imgs:[42,81],sizes:['XS','S','M','L'],colors:['Denim','White'],pop:70},
 {slug:'sunglasses',name:'Sunglasses',cat:'accessories',sub:'Eyewear',price:90,imgs:[26,27],colors:['Black'],pop:81},
 {slug:'single',name:'Single',cat:'accessories',sub:'Digital',price:2,regular:3,art:'single',type:'downloadable',pop:40},
 {slug:'polo',name:'Polo',cat:'men',sub:'T-Shirts',price:20,imgs:[69,71],sizes:['S','M','L','XL'],colors:['Pink','Black'],pop:66},
 {slug:'long-sleeve-tee',name:'Long Sleeve Tee',cat:'women',sub:'Knitwear',price:25,imgs:[44,72],sizes:SZ,colors:['White','Cream'],outSizes:['XS'],pop:58},
 {slug:'hoodie',name:'Hoodie',cat:'men',sub:'Jackets',price:45,regular:52,imgs:[62,79],sizes:['S','M','L','XL'],colors:['Denim','Navy'],pop:79},
 {slug:'beanie',name:'Beanie',cat:'accessories',sub:'Headwear',price:18,regular:20,imgs:[20,30],colors:['Orange'],pop:52},
 {slug:'cap',name:'Cap',cat:'accessories',sub:'Headwear',price:16,regular:18,imgs:[30,47],colors:['Grey','White'],pop:49},
 {slug:'album',name:'Album',cat:'accessories',sub:'Digital',price:15,art:'album',type:'downloadable',pop:44},
 {slug:'blake-bravado-jacket',name:'Blake Bravado Jacket',cat:'men',sub:'Jackets',price:120,regular:150,imgs:[38,22],sizes:['S','M','L','XL'],colors:['Brown'],pop:95,isNew:true},
 {slug:'solstice-silk-blouse',name:'Solstice Silk Blouse',cat:'women',sub:'Tops',price:180,regular:257,imgs:[35,2],sizes:['XS','S','M','L'],colors:['Rust','Teal'],outCombos:['L|Teal'],pop:97,isNew:true},
 {slug:'phoenix-prestige-blazer',name:'Phoenix Prestige Blazer',cat:'men',sub:'Tailoring',price:150,regular:176,imgs:[40,93],sizes:['S','M','L','XL'],colors:['Black','Navy'],pop:90},
 {slug:'brick-lane-leather',name:'Brick Lane Leather Jacket',cat:'men',sub:'Jackets',price:210,imgs:[75,22],sizes:['M','L','XL'],colors:['Black'],stock:'low',stockQty:3,pop:84},
 {slug:'rust-bomber',name:'Rust Bomber Jacket',cat:'men',sub:'Jackets',price:110,imgs:[23,38],sizes:['S','M','L','XL'],colors:['Rust'],isNew:true,pop:77},
 {slug:'heritage-denim-jacket',name:'Heritage Denim Jacket',cat:'men',sub:'Jackets',price:95,imgs:[79,62],sizes:['S','M','L','XL'],colors:['Denim'],outSizes:['S'],pop:72},
 {slug:'midnight-check-suit',name:'Midnight Check Suit',cat:'men',sub:'Tailoring',price:290,imgs:[77,16],sizes:['M','L','XL'],colors:['Navy'],pop:61},
 {slug:'marigold-knit',name:'Marigold Knit Sweater',cat:'women',sub:'Knitwear',price:68,imgs:[92,72],sizes:SZ,colors:['Orange','Cream'],isNew:true,pop:86},
 {slug:'riviera-wrap-dress',name:'Riviera Wrap Dress',cat:'women',sub:'Dresses',price:89,imgs:[10,74],sizes:['XS','S','M','L'],colors:['Cream'],pop:69},
 {slug:'sunset-tracksuit',name:'Sunset Tracksuit',cat:'women',sub:'Sets',price:74,imgs:[0,45],sizes:SZ,colors:['Yellow','Pink'],isNew:true,pop:83},
 {slug:'bordeaux-midi-dress',name:'Bordeaux Midi Dress',cat:'women',sub:'Dresses',price:96,imgs:[70,98],sizes:['XS','S','M','L'],colors:['Burgundy'],stock:'out',pop:64},
 {slug:'lagoon-wide-trousers',name:'Lagoon Wide-Leg Trousers',cat:'women',sub:'Trousers',price:82,imgs:[2,35],sizes:SZ,colors:['Black','Teal'],pop:71},
 {slug:'city-trench',name:'City Trench Coat',cat:'women',sub:'Outerwear',price:165,imgs:[36,12],sizes:['S','M','L'],colors:['Denim','Navy'],pop:76},
 {slug:'velvet-dusk-gown',name:'Velvet Dusk Gown',cat:'women',sub:'Dresses',price:140,regular:175,imgs:[98,70],sizes:['XS','S','M','L'],colors:['Burgundy'],pop:67},
 {slug:'explorer-raincoat',name:'Explorer Raincoat',cat:'kids',sub:'Outerwear',price:42,imgs:[94,17],sizes:KSZ,colors:['Yellow'],isNew:true,pop:73},
 {slug:'little-gent-set',name:'Little Gent Set',cat:'kids',sub:'Sets',price:58,imgs:[18,19],sizes:KSZ,colors:['Navy'],pop:55},
 {slug:'checked-play-shirt',name:'Checked Play Shirt',cat:'kids',sub:'Shirts',price:29,regular:34,imgs:[19,18],sizes:KSZ,colors:['Navy','Red'],pop:57},
 {slug:'teddy-onesie',name:'Teddy Onesie',cat:'kids',sub:'Baby',price:35,imgs:[49,19],sizes:['0-6M','6-12M','12-18M'],colors:['Brown'],pop:63},
 {slug:'weekend-tee-duo',name:'Weekend Tee Duo',cat:'kids',sub:'Shirts',price:24,imgs:[17,94],sizes:KSZ,colors:['White'],stock:'out',pop:48},
 {slug:'crimson-top-handle',name:'Crimson Top-Handle Bag',cat:'accessories',sub:'Bags',price:135,imgs:[29,3],colors:['Red'],pop:80},
 {slug:'metro-backpack',name:'Metro Backpack',cat:'accessories',sub:'Bags',price:70,imgs:[28,20],colors:['Navy'],pop:60},
 {slug:'jade-drop-earrings',name:'Jade Drop Earrings',cat:'accessories',sub:'Jewellery',price:54,imgs:[97,65],colors:['Green'],pop:53},
 {slug:'velvet-court-sneakers',name:'Velvet Court Sneakers',cat:'accessories',sub:'Footwear',price:79,imgs:[86,25],sizes:SHOE,colors:['Burgundy'],outSizes:['44'],pop:78},
 {slug:'ember-runner',name:'Ember Runner',cat:'accessories',sub:'Footwear',price:99,regular:120,imgs:[85,87],sizes:SHOE,colors:['Orange','White'],isNew:true,pop:82},
 {slug:'ochre-lounge-chair',name:'Ochre Lounge Chair',cat:'home-living',sub:'Furniture',price:240,imgs:[51,31],colors:['Yellow'],pop:59},
 {slug:'cloud-sofa',name:'Cloud Sofa',cat:'home-living',sub:'Furniture',price:890,imgs:[52,32],colors:['Grey'],stock:'low',stockQty:2,pop:65},
 {slug:'studio-side-chair',name:'Studio Side Chair',cat:'home-living',sub:'Furniture',price:160,imgs:[89,33],colors:['Grey'],pop:46}
];
const DESC={women:'Cut with an easy, flattering line and finished with retro details, this piece moves from day to late night without effort.',men:'A confident silhouette with vintage character — structured where it counts, relaxed everywhere else.',kids:'Soft, durable and made for movement. Pre-washed for comfort and built to keep up with every adventure.',accessories:'The finishing piece your outfit has been waiting for — compact, considered and made to be worn often.','home-living':'Bring the WooNext palette home with a piece designed to become the warm centre of the room.'};
const REV=[['Kristin W.','Fits exactly as described and the colour is even richer in person.'],['Jane C.','Quality feels premium for the price. Already planning my next order.'],['Marco D.','Arrived quickly and beautifully packed. Sizing ran true for me.'],['Priya S.','Gets compliments every time I wear it. The retro styling is spot on.'],['Leo T.','Great everyday piece — washes well and keeps its shape.']];
P.forEach((p,i)=>{p.id=101+i;p.sizes=p.sizes||[];p.colors=p.colors||[];p.outSizes=p.outSizes||[];p.outCombos=p.outCombos||[];p.stock=p.stock||'in';p.imgs=p.imgs||[];
 p.type=p.type||((p.sizes.length||p.colors.length>1)?'variable':'simple');
 p.rating=Math.round((4+((i*37)%10)/10)*10)/10;p.reviews=6+((i*53)%140);p.date=Date.parse('2026-11-10')-i*86400000*((i*7)%9+1);
 p.desc=p.type==='downloadable'?'A digital release from the WooNext label. Download instantly after checkout from your account — no shipping required.':DESC[p.cat];
 p.details=p.type==='downloadable'?['Format: MP3 320 kbps + lossless WAV','Instant download from My Account → Downloads','Download limit: 5 per purchase']:p.cat==='home-living'?['Dimensions listed in the size guide','Ships flat-packed, tools included','Wipe clean with a damp cloth']:['Regular fit — take your usual size','Machine wash cold, line dry','Model wears size M'];
 p.revList=[0,1,2].map(k=>{const r=REV[(i+k)%REV.length];return{name:r[0],text:r[1],rating:k===2?4:5,date:['2 weeks ago','1 month ago','2 months ago'][k]}});
});
const bySlug=s=>P.find(p=>p.slug===s);const byId=id=>P.find(p=>p.id===id);
const get=x=>typeof x==='number'?byId(x):bySlug(x)||byId(+x);
const unitPrice=(p,size)=>(p.priceBySize&&p.priceBySize[size])||p.price;
const priceLabel=p=>p.priceBySize?fmt(p.price)+' – '+fmt(Math.max(...Object.values(p.priceBySize))):fmt(p.price);
const comboOut=(p,s,c)=>p.stock==='out'||p.outSizes.includes(s)||p.outCombos.includes(s+'|'+c);
const COUPONS={WOONEXT10:{type:'pct',v:10,label:'10% off your order'},RETRO25:{type:'pct',v:25,min:150,label:'25% off orders over 150 €'},FREESHIP:{type:'ship',label:'Free standard shipping'}};
const SHIP={standard:{label:'Standard delivery',cost:4.95,eta:'3–5 working days'},express:{label:'Express delivery',cost:12.95,eta:'1–2 working days'},pickup:{label:'Store pickup',cost:0,eta:'Ready in 24 hours'}};
const PAY={card:'Card (simulated)',paypal:'PayPal (simulated)',bank:'Direct bank transfer',cod:'Cash on delivery'};
function totals(items,code,ship){
 const lines=items.map(it=>{const p=get(it.id);const u=unitPrice(p,it.size);return{...it,p,unit:u,line:u*it.qty}});
 const sub=lines.reduce((a,l)=>a+l.line,0);const c=code&&COUPONS[code];let disc=0,cErr='';
 if(c){if(c.min&&sub<c.min)cErr=`${code} needs a subtotal of ${fmt(c.min)}`;else if(c.type==='pct')disc=sub*c.v/100;}
 const digital=lines.length&&lines.every(l=>l.p.type==='downloadable');const sm=SHIP[ship||'standard'];
 let shipping=(digital||!lines.length)?0:sm.cost;if((ship||'standard')==='standard'&&(sub-disc>=75||(c&&c.type==='ship')))shipping=0;
 const total=Math.max(0,sub-disc+shipping);
 return{lines,sub,disc,shipping,total,vat:total*21/121,count:items.reduce((a,i)=>a+i.qty,0),digital,coupon:c&&!cErr?code:'',cErr,freeLeft:Math.max(0,75-(sub-disc))};
}
function matchQ(p,q){q=(q||'').trim().toLowerCase();if(!q)return true;const c=CATS.find(c=>c.slug===p.cat);return (p.name+' '+p.sub+' '+(c?c.label:'')+' '+p.colors.join(' ')).toLowerCase().includes(q)||q.split(/\s+/).every(w=>(p.name+' '+p.sub+' '+p.cat).toLowerCase().includes(w));}
const PRICE=[{id:'u25',label:'Under 25 €',t:p=>p.price<25},{id:'25-75',label:'25 – 75 €',t:p=>p.price>=25&&p.price<75},{id:'75-150',label:'75 – 150 €',t:p=>p.price>=75&&p.price<150},{id:'150',label:'150 € and above',t:p=>p.price>=150}];
function base(mode,arg){if(mode==='category'){if(arg==='new')return P.filter(p=>p.isNew);if(arg==='offers')return P.filter(p=>p.regular);return P.filter(p=>p.cat===arg);}if(mode==='search')return P.filter(p=>matchQ(p,arg));return P.slice();}
function query(list,f){let r=list.filter(p=>(!f.cats||!f.cats.length||f.cats.includes(p.cat))&&(!f.subs||!f.subs.length||f.subs.includes(p.sub))&&(!f.sizes||!f.sizes.length||p.sizes.some(s=>f.sizes.includes(s)&&!p.outSizes.includes(s)))&&(!f.colors||!f.colors.length||p.colors.some(c=>f.colors.includes(c)))&&(!f.inStock||p.stock!=='out')&&(!f.price||PRICE.find(x=>x.id===f.price).t(p)));
 const s=f.sort||'relevance';if(s==='newest')r.sort((a,b)=>b.date-a.date);else if(s==='price-asc')r.sort((a,b)=>a.price-b.price);else if(s==='price-desc')r.sort((a,b)=>b.price-a.price);else if(s==='popular')r.sort((a,b)=>b.pop-a.pop);return r;}
const ADDR={first:'Alex',last:'Demo',company:'',address:'Kaiserstraße 12',city:'Berlin',postcode:'10115',country:'Germany',phone:'+49 30 1234 5678',email:'demo@woonext.store'};
const STATUSES=['processing','shipped','completed','on-hold','cancelled'];
function mkOrder(n,daysAgo,status,items,pay){const t=totals(items,'',  'standard');return{id:'WN-'+n,date:Date.parse('2026-11-12')-daysAgo*86400000,status,items:t.lines.map(l=>({id:l.id,name:l.p.name,size:l.size||'',color:l.color||'',qty:l.qty,unit:l.unit,img:l.p.imgs[0]!=null?img(l.p.imgs[0],300):'',art:l.p.art||'',type:l.p.type})),sub:t.sub,disc:t.disc,shipping:t.shipping,total:t.total,vat:t.vat,ship:'standard',pay:pay||'card',billing:{...ADDR},shippingAddr:{...ADDR},email:ADDR.email,eta:'',note:''};}
function seed(){return[mkOrder(10471,3,'processing',[{id:113,size:'M',color:'Rust',qty:1}]),mkOrder(10458,12,'shipped',[{id:113,size:'L',color:'Brown',qty:1},{id:105,qty:1}]),mkOrder(10433,26,'completed',[{id:106,qty:1},{id:112,qty:1}],'paypal'),mkOrder(10402,41,'completed',[{id:120,size:'M',color:'Orange',qty:2}]),mkOrder(10377,58,'cancelled',[{id:133,qty:1}]),mkOrder(10351,77,'completed',[{id:102,size:'M',color:'White',qty:3}]),mkOrder(10320,96,'on-hold',[{id:128,size:'6Y',color:'Navy',qty:1}],'bank'),mkOrder(10296,121,'completed',[{id:138,qty:1}])];}
const KEY='woonext-demo-v1';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const S={cart:saved.cart||[],wish:saved.wish||[113,114],orders:saved.orders||seed(),user:saved.user||null,recent:saved.recent||[],coupon:saved.coupon||'',ship:saved.ship||'standard',cards:saved.cards||[{id:'c1',brand:'Visa',last4:'4242',exp:'08/28',def:true},{id:'c2',brand:'Mastercard',last4:'5100',exp:'11/27',def:false}],addr:saved.addr||{billing:{...ADDR},shipping:{...ADDR}},buyNow:saved.buyNow||null,lastOrder:saved.lastOrder||null,
 ui:{cart:false,search:false,nav:false,quick:null,sizeGuide:false},toasts:[]};
const subs=new Set();let raf=0;
function persist(){const {ui,toasts,...rest}=S;try{localStorage.setItem(KEY,JSON.stringify(rest))}catch(e){}}
function emit(){subs.forEach(f=>{try{f()}catch(e){console.error(e)}})}
function set(patch){Object.assign(S,typeof patch==='function'?patch(S):patch);persist();emit();}
function ui(patch){S.ui={...S.ui,...patch};emit();}
let tid=0;function toast(msg,o){const id=++tid;const t={id,msg,tone:(o&&o.tone)||'ok',actionLabel:o&&o.actionLabel,action:o&&o.action?()=>{o.action();dismiss(id)}:null,close:()=>dismiss(id)};S.toasts=[...S.toasts.slice(-2),t];emit();setTimeout(()=>dismiss(id),(o&&o.ms)||4200);}
function dismiss(id){S.toasts=S.toasts.filter(t=>t.id!==id);emit();}
const keyOf=(id,size,color)=>[id,size||'',color||''].join('|');
function addToCart(id,o){o=o||{};const p=get(id);if(!p||p.stock==='out')return false;const k=keyOf(p.id,o.size,o.color);const ex=S.cart.find(i=>i.key===k);const qty=o.qty||1;
 const cart=ex?S.cart.map(i=>i.key===k?{...i,qty:Math.min(10,i.qty+qty)}:i):[...S.cart,{key:k,id:p.id,size:o.size||'',color:o.color||'',qty}];set({cart});
 toast(`${p.name}${o.size?' ('+o.size+')':''} added to your bag`,{actionLabel:'View bag',action:()=>ui({cart:true})});return true;}
function setQty(k,q){set({cart:S.cart.map(i=>i.key===k?{...i,qty:Math.max(1,Math.min(10,q))}:i)})}
function removeItem(k){const idx=S.cart.findIndex(i=>i.key===k);if(idx<0)return;const it=S.cart[idx];const p=get(it.id);set({cart:S.cart.filter(i=>i.key!==k)});
 toast(`${p.name} removed from your bag`,{tone:'info',actionLabel:'Undo',action:()=>{const c=S.cart.slice();c.splice(idx,0,it);set({cart:c})},ms:6000});}
function toggleWish(id){const p=get(id);const on=S.wish.includes(p.id);set({wish:on?S.wish.filter(x=>x!==p.id):[...S.wish,p.id]});toast(on?`${p.name} removed from wishlist`:`${p.name} saved to your wishlist`,{tone:on?'info':'love',actionLabel:on?null:'View',action:on?null:()=>go('/wishlist')});}
function go(path){location.hash='#'+path}
function parse(){const h=(location.hash||'#/').replace(/^#\/?/,'');const parts=h.split('/').filter(Boolean).map(decodeURIComponent);return{name:parts[0]||'home',a:parts[1]||'',b:parts[2]||'',path:'/'+parts.join('/')}}
let route=parse();
window.addEventListener('hashchange',()=>{route=parse();S.ui={...S.ui,cart:false,search:false,nav:false,quick:null,sizeGuide:false};
 if(route.name==='product'){const p=get(route.a);if(p)S.recent=[p.id,...S.recent.filter(x=>x!==p.id)].slice(0,8);persist();}
 window.scrollTo({top:0});emit();});
if(route.name==='product'){const p=get(route.a);if(p)S.recent=[p.id,...S.recent.filter(x=>x!==p.id)].slice(0,8);}
const FOC='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])';
const STACK=[];function trap(el,onClose){if(!el)return()=>{};const me={};STACK.push(me);const prev=document.activeElement;const list=()=>[...el.querySelectorAll(FOC)].filter(x=>x.offsetParent!==null);
 setTimeout(()=>{const a=el.querySelector('[data-autofocus]')||list()[0]||el;a&&a.focus&&a.focus()},80);
 const k=e=>{if(STACK[STACK.length-1]!==me)return;if(e.key==='Escape'){e.preventDefault();onClose()}else if(e.key==='Tab'){const a=list();if(!a.length)return;const f=a[0],l=a[a.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}};
 document.addEventListener('keydown',k);return()=>{const i=STACK.indexOf(me);if(i>=0)STACK.splice(i,1);document.removeEventListener('keydown',k);if(prev&&prev.focus&&document.contains(prev))prev.focus()};}
function placeOrder(d){const n=10480+S.orders.length+Math.floor(Math.random()*9);const items=d.items;const t=totals(items,d.coupon,d.ship);
 const o={id:'WN-'+n,date:Date.now(),status:d.pay==='bank'?'on-hold':'processing',items:t.lines.map(l=>({id:l.id,name:l.p.name,size:l.size,color:l.color,qty:l.qty,unit:l.unit,img:l.p.imgs[0]!=null?img(l.p.imgs[0],300):'',art:l.p.art||'',type:l.p.type})),sub:t.sub,disc:t.disc,coupon:t.coupon,shipping:t.shipping,total:t.total,vat:t.vat,ship:d.ship,pay:d.pay,billing:d.billing,shippingAddr:d.shippingAddr,email:d.billing.email,note:d.note||'',eta:SHIP[d.ship].eta};
 set({orders:[o,...S.orders],cart:d.fromBuyNow?S.cart:[],coupon:d.fromBuyNow?S.coupon:'',buyNow:null,lastOrder:o.id});return o;}
const dateFmt=t=>new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
window.WN={IDS,img,fmt,dateFmt,SWATCH,CATS,P,get,unitPrice,priceLabel,comboOut,COUPONS,SHIP,PAY,PRICE,totals,base,query,matchQ,STATUSES,
 get state(){return S},get route(){return route},set,ui,toast,dismiss,addToCart,setQty,removeItem,toggleWish,go,trap,placeOrder,
 isWished:id=>S.wish.includes(id),subscribe:f=>{subs.add(f);return()=>subs.delete(f)},cartTotals:()=>totals(S.cart,S.coupon,S.ship)};
})();
