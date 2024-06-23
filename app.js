let hrs=document.querySelector("#hrs");
let min=document.querySelector("#min");
let sec=document.querySelector("#sec");

let hrs1=document.querySelector(".hrs");
let min1=document.querySelector(".min");
let sec1=document.querySelector(".sec");

setInterval(()=>
{
    let today=new Date();
    
    let ms=today.getMilliseconds()*6;
    let h=today.getHours()*30;
    let m=today.getMinutes()*6;
    let s=today.getSeconds()*6+ms/1000;
    

    let a1=hrs.style.transform=`rotateZ(${(h)+m/12}deg)`;
    let a2=min.style.transform=`rotateZ(${(m)}deg)`;
    let a3=sec.style.transform=`rotateZ(${(s)}deg)`;
    setInterval(()=>
        {
           
            
    },1);
    
    console.log("first ="+s);
    console.log("second = "+s1);

},1000);