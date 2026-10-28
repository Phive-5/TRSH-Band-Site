const images = [
  'TRSH-Gallery/536494189_2052628398599275_6473765699219255541_n.jpg',
  'TRSH-Gallery/583235571_18079668794469199_8872860766650832020_n.jpg',
  'TRSH-Gallery/588164443_18082218056469199_5830331112678805686_n.jpg',
  'TRSH-Gallery/589909835_17934465153129471_253369886629241571_n.jpg',
  'TRSH-Gallery/590410868_18081635642469199_6086878782254337937_n.jpg',
  'TRSH-Gallery/590415361_18081635690469199_8076249683092526099_n.jpg',
  'TRSH-Gallery/590420634_18081635654469199_7543784754288186847_n.jpg',
  'TRSH-Gallery/597858911_18081897863469199_8518582298847969517_n.jpg',
  'TRSH-Gallery/602832605_18082593893469199_1719941826955224760_n.jpg',
  'TRSH-Gallery/602905134_18082593881469199_1336704548001962456_n.jpg',
  'TRSH-Gallery/609620399_18084134567469199_282553648184513823_n.jpg',
  'TRSH-Gallery/658751423_18095208446469199_6864248603267980923_n.jpg',
  'TRSH-Gallery/663109051_18095208449469199_2063373163957495661_n.jpg',
  'TRSH-Gallery/670352551_18095319647469199_5405889830189757907_n.jpg',
  'TRSH-Gallery/670403305_18096001712469199_4181939386937975192_n.jpg',
  'TRSH-Gallery/670638899_18096001658469199_8788818079632387471_n.jpg',
  'TRSH-Gallery/670762177_18095208455469199_5399457097227964390_n.jpg',
  'TRSH-Gallery/670776896_18095427221469199_5709934777904340466_n.jpg',
  'TRSH-Gallery/670866312_18095659064469199_1294278255182047712_n.jpg',
  'TRSH-Gallery/670883660_18096001628469199_1467483896501299022_n.jpg',
  'TRSH-Gallery/670971575_18096462524469199_2866719038692652068_n.jpg',
  'TRSH-Gallery/671056805_18095887109469199_4416739204713371641_n.jpg',
  'TRSH-Gallery/671124965_18099056051469199_6315447899163929028_n.jpg',
  'TRSH-Gallery/671144020_18096341075469199_5088010310936932983_n.jpg',
  'TRSH-Gallery/671275661_18096001610469199_5028359906520706262_n.jpg',
  'TRSH-Gallery/671846005_18099056033469199_4195838192902317443_n.jpg',
  'TRSH-Gallery/672390720_18098068136469199_4970320043390145005_n.jpg',
  'TRSH-Gallery/673804961_18096607742469199_2272109435036463664_n.jpg',
  'TRSH-Gallery/673834789_18096607769469199_6861546004077410500_n.jpg',
  'TRSH-Gallery/674522192_18096607760469199_3859666459467344936_n.jpg',
  'TRSH-Gallery/688321744_18098508728469199_7474774894331748704_n.jpg',
  'TRSH-Gallery/724270779_18156929146474901_8042212814127280793_n.jpg',
  'TRSH-Gallery/789236997_18112590416054793_8534841614068955770_n.jpg',
  'TRSH-Gallery/851887523_18221225686352073_4077932604751630079_n.jpg',
  'TRSH-Gallery/853440693_18221225701352073_8963682258473759484_n.jpg',
];

const TRANSITION_DURATION = 2000;
const DISPLAY_DURATION = 12000;
const KEN_BURNS_CLASSES = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3', 'ken-burns-4'];

let currentIndex = 0;
let slides = [];
let transitionTimer = null;
let noiseCanvas = null;
let noiseCtx = null;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createSlides() {
  const container = document.getElementById('bgSlideshow');
  const shuffledImages = shuffleArray([...images]);

  shuffledImages.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = `bg-slide ${KEN_BURNS_CLASSES[i % KEN_BURNS_CLASSES.length]}`;
    div.style.backgroundImage = `url(${src})`;
    div.style.animationDelay = `-${i * 12}s`;
    container.appendChild(div);
  });

  slides = container.querySelectorAll('.bg-slide');
  slides[0].classList.add('active');
}

function initNoiseCanvas() {
  if (noiseCanvas) return;
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.className = 'noise-overlay';
  noiseCanvas.width = window.innerWidth;
  noiseCanvas.height = window.innerHeight;
  noiseCtx = noiseCanvas.getContext('2d');
  document.getElementById('bgSlideshow').appendChild(noiseCanvas);
  window.addEventListener('resize', () => {
    noiseCanvas.width = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
  });
}

function generateNoise() {
  if (!noiseCtx || !noiseCanvas) return;
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const imageData = noiseCtx.createImageData(w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  noiseCtx.putImageData(imageData, 0, 0);
}

function generateColorNoise() {
  if (!noiseCtx || !noiseCanvas) return;
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const imageData = noiseCtx.createImageData(w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.random() * 255;
    data[i + 1] = Math.random() * 255;
    data[i + 2] = Math.random() * 255;
    data[i + 3] = Math.random() > 0.3 ? 255 : 0;
  }
  noiseCtx.putImageData(imageData, 0, 0);
}

function randomDir() {
  const dirs = ['left', 'right', 'up', 'down'];
  return dirs[Math.floor(Math.random() * 4)];
}

function saveKB(slide) {
  const kept = KEN_BURNS_CLASSES.filter(c => slide.classList.contains(c));
  slide.classList.remove(...kept);
  return kept;
}

function restoreKB(slide, classes) {
  if (!classes.length) return;
  const computed = getComputedStyle(slide).transform;
  if (computed && computed !== 'none') {
    slide.style.transform = computed;
  }
  slide.classList.add(...classes);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slide.style.transform = '';
    });
  });
}

function transitionDirectionalFade(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);
  const dir = randomDir();
  const dist = 40;
  let x = 0, y = 0;
  if (dir === 'left') x = dist;
  else if (dir === 'right') x = -dist;
  else if (dir === 'up') y = dist;
  else y = -dist;

  next.style.transition = 'none';
  next.style.transform = `translate(${x}px, ${y}px)`;
  next.style.opacity = '0';

  current.style.transition = `opacity ${TRANSITION_DURATION}ms ease`;
  current.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`;
      next.style.transform = 'translate(0, 0)';
      next.style.opacity = '1';
    });
  });

  setTimeout(() => {
    current.style.transition = '';
    current.style.opacity = '';
    next.style.transition = '';
    next.style.transform = '';
    next.style.opacity = '';
    restoreKB(current, kbCurr);
    restoreKB(next, kbNext);
    done();
  }, TRANSITION_DURATION);
}

function transitionZoomBurst(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);
  const zoomIn = Math.random() > 0.5;
  const startScale = zoomIn ? 1.4 : 0.6;

  next.style.transition = 'none';
  next.style.transform = `scale(${startScale})`;
  next.style.opacity = '0';

  current.style.transition = `opacity ${TRANSITION_DURATION * 0.5}ms ease`;
  current.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${TRANSITION_DURATION * 0.4}ms ease`;
      next.style.transform = 'scale(1)';
      next.style.opacity = '1';
    });
  });

  setTimeout(() => {
    current.style.transition = '';
    current.style.opacity = '';
    next.style.transition = '';
    next.style.transform = '';
    next.style.opacity = '';
    restoreKB(current, kbCurr);
    restoreKB(next, kbNext);
    done();
  }, TRANSITION_DURATION);
}

function transitionBlurReveal(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);

  next.style.transition = 'none';
  next.style.filter = 'blur(30px)';
  next.style.opacity = '0';

  current.style.transition = `opacity ${TRANSITION_DURATION}ms ease, filter ${TRANSITION_DURATION}ms ease`;
  current.style.opacity = '0';
  current.style.filter = 'blur(10px)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = `opacity ${TRANSITION_DURATION}ms ease, filter ${TRANSITION_DURATION}ms ease`;
      next.style.opacity = '1';
      next.style.filter = 'blur(0)';
    });
  });

  setTimeout(() => {
    current.style.transition = '';
    current.style.opacity = '';
    current.style.filter = '';
    next.style.transition = '';
    next.style.filter = '';
    next.style.opacity = '';
    restoreKB(current, kbCurr);
    restoreKB(next, kbNext);
    done();
  }, TRANSITION_DURATION);
}

function transitionPanSwipe(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);
  const dir = Math.random() > 0.5 ? 1 : -1;

  next.style.transition = 'none';
  next.style.transform = `translateX(${dir * 100}%)`;
  next.style.opacity = '1';

  current.style.transition = `transform ${TRANSITION_DURATION}ms ease`;
  current.style.transform = `translateX(${-dir * 100}%)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = `transform ${TRANSITION_DURATION}ms ease`;
      next.style.transform = 'translateX(0)';
    });
  });

  setTimeout(() => {
    current.style.transition = '';
    current.style.transform = '';
    next.style.transition = '';
    next.style.transform = '';
    next.style.opacity = '';
    restoreKB(current, kbCurr);
    restoreKB(next, kbNext);
    done();
  }, TRANSITION_DURATION);
}

function transitionScaleWipe(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);

  next.style.transition = 'none';
  next.style.transform = 'scale(0.8)';
  next.style.opacity = '0';

  current.style.transition = `opacity ${TRANSITION_DURATION * 0.5}ms ease`;
  current.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${TRANSITION_DURATION}ms ease`;
      next.style.transform = 'scale(1)';
      next.style.opacity = '1';
    });
  });

  setTimeout(() => {
    current.style.transition = '';
    current.style.opacity = '';
    next.style.transition = '';
    next.style.transform = '';
    next.style.opacity = '';
    restoreKB(current, kbCurr);
    restoreKB(next, kbNext);
    done();
  }, TRANSITION_DURATION);
}

function transitionGrainDissolve(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);
  initNoiseCanvas();

  noiseCanvas.style.transition = 'none';
  noiseCanvas.style.opacity = '1';
  noiseCanvas.style.mixBlendMode = 'overlay';
  const noiseInt = setInterval(() => generateNoise(), 40);

  const half = TRANSITION_DURATION / 2;

  setTimeout(() => {
    next.style.opacity = '1';
    current.style.opacity = '0';
  }, half);

  setTimeout(() => {
    noiseCanvas.style.transition = 'opacity 500ms ease';
    noiseCanvas.style.opacity = '0';
    setTimeout(() => {
      clearInterval(noiseInt);
      noiseCanvas.style.transition = '';
      current.style.transition = '';
      current.style.opacity = '';
      next.style.opacity = '';
      restoreKB(current, kbCurr);
      restoreKB(next, kbNext);
      done();
    }, 500);
  }, half + 200);
}

function transitionCrtGlitch(current, next, done) {
  const kbCurr = saveKB(current);
  const kbNext = saveKB(next);
  initNoiseCanvas();

  noiseCanvas.style.transition = 'none';
  noiseCanvas.style.opacity = '0.7';
  noiseCanvas.style.mixBlendMode = 'screen';

  current.style.transition = 'none';
  current.style.transform = `translate(${Math.random() * 8 - 4}px, ${Math.random() * 4 - 2}px)`;
  current.style.filter = 'hue-rotate(40deg)';

  generateColorNoise();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      let frame = 0;
      const glitchInt = setInterval(() => {
        current.style.transform = `translate(${Math.random() * 14 - 7}px, ${Math.random() * 6 - 3}px) skewX(${Math.random() * 2 - 1}deg)`;
        current.style.filter = `hue-rotate(${Math.random() * 80 - 40}deg) contrast(${1 + Math.random() * 0.5})`;
        generateColorNoise();
        frame++;
        if (frame > 10) {
          clearInterval(glitchInt);
          noiseCanvas.style.transition = 'opacity 200ms ease';
          noiseCanvas.style.opacity = '0';

          current.style.transition = 'opacity 300ms ease';
          current.style.opacity = '0';
          current.style.transform = '';
          current.style.filter = '';

          next.style.opacity = '1';

          setTimeout(() => {
            noiseCanvas.style.transition = '';
            noiseCanvas.style.mixBlendMode = '';
            current.style.transition = '';
            current.style.opacity = '';
            next.style.opacity = '';
            restoreKB(current, kbCurr);
            restoreKB(next, kbNext);
            done();
          }, 300);
        }
      }, 70);
    });
  });
}

const transitions = [
  transitionDirectionalFade,
  transitionZoomBurst,
  transitionBlurReveal,
  transitionPanSwipe,
  transitionScaleWipe,
  transitionGrainDissolve,
  transitionCrtGlitch,
];

function transitionTo(index) {
  if (transitionTimer) return;

  const current = slides[currentIndex];
  const next = slides[index];

  if (current === next) return;

  transitionTimer = true;

  const fn = transitions[Math.floor(Math.random() * transitions.length)];
  fn(current, next, () => {
    current.classList.remove('transitioning-in', 'active');
    next.classList.remove('transitioning-in');
    next.classList.add('active');
    currentIndex = index;
    transitionTimer = null;
  });
}

function startSlideshow() {
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    transitionTo(nextIndex);
  }, DISPLAY_DURATION);
}

document.addEventListener('DOMContentLoaded', () => {
  createSlides();
  startSlideshow();

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('open');
      mainNav.classList.remove('open');
    }
  });

  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mainNav.classList.remove('open');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

// Anti burn-in: pixel shift
(function() {
  var idx = 0;
  var positions = [[0,0],[1,1],[0,0],[-1,-1],[0,0],[1,-1],[0,0],[-1,1]];
  function shift() {
    idx = (idx + 1) % positions.length;
    document.body.style.transform = 'translate(' + positions[idx][0] + 'px,' + positions[idx][1] + 'px)';
    document.body.style.transition = 'transform 2.5s ease-in-out';
  }
  setTimeout(function() { shift(); setInterval(shift, 180000); }, 120000);
})();
