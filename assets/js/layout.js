let start = document.getElementById('start');
let reset = document.getElementById('reset');

let days = document.getElementById('days');
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');

let dd = document.getElementById('dd');
let hh = document.getElementById('hh');
let mm = document.getElementById('mm');
let ss = document.getElementById('ss');

let day_dot = document.querySelector('.day_dot');
let hr_dot = document.querySelector(".hr_dot");
let min_dot = document.querySelector(".min_dot");
let sec_dot = document.querySelector(".sec_dot");

let endDate = '06/01/2024 00:00:00';
// mm/dd/yyyy
start.addEventListener("click", function (e) {
    let cTime1 = new Date();
    let cTime2 = new Date(cTime1);
    endDate = cTime2.setMinutes ( cTime2.getMinutes() + 50 );
    let body = document.querySelector('body');
    body.classList.add("on");
});

reset.addEventListener("click", function (e) {
    endDate = '06/01/2024 00:00:00';
    let body = document.querySelector("body");
    body.classList.remove("on");
});
let x = setInterval( function() {
    let now = new Date(endDate).getTime();
    let countDown = new Date().getTime();
    let distance = now - countDown;

    //time calc for days, hours, minutes, seconds
    let d = Math.floor(distance / (1000 * 60 * 60 * 24));
    let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((distance % (1000 * 60)) / (1000));

    //output the result in elem with id
    days.innerHTML = d + "<br><span>дней</span>";
    hours.innerHTML = h + "<br><span>часов</span>";
    minutes.innerHTML = m + "<br><span>минут</span>";
    seconds.innerHTML = s + "<br><span>секунд</span>";

    //animate stroke
    dd.style.strokeDashoffset = 440 - (440 * d) / 365;
    hh.style.strokeDashoffset = 440 - (440 * h) / 24;
    mm.style.strokeDashoffset = 440 - (440 * m) / 60;
    ss.style.strokeDashoffset = 440 - (440 * s) / 60;

    //animate dots
    day_dot.style.transform = `rotateZ(${d * 0.986}deg)`;
    hr_dot.style.transform = `rotateZ(${h * 15}deg)`;
    min_dot.style.transform = `rotateZ(${m * 6}deg)`;
    sec_dot.style.transform = `rotateZ(${s * 6}deg)`;

    // if the countdown is over - do smth - write text
    if(distance < 0){
        clearInterval(x);
        endDate = "06/01/2024 00:00:00";
        let body = document.querySelector("body");
        body.classList.remove("on");
        //document.getElementById('time').style.display = 'none';
        //document.querySelector('.newYear').style.display = 'block';
    }
})


/* function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("playing");
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;

  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
window.addEventListener("keydown", playSound); */