/**
 * GSAP 高级交互效果
 * 心联科技博客 - Awwwards 风格动画
 * @version 1.0.0
 */

(function () {
  'use strict';

  // 检查GSAP是否加载
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  // 注册ScrollTrigger插件
  gsap.registerPlugin(ScrollTrigger);

  // 全局配置
  gsap.config({
    nullTargetWarn: false,
  });

  // ScrollTrigger配置
  ScrollTrigger.config({
    ignoreMobileResize: true
  });

  // ============================================
  // 工具函数
  // ============================================

  const isMobile = () => window.innerWidth < 768;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================
  // 首页英雄区块动画
  // ============================================

  function initHeroAnimations() {
    const heroSection = document.querySelector('.index-cover, .bg-cover');
    if (!heroSection) return;

    const heroTl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // 标题动画
    heroTl
      .from(".bg-cover .title, .typed-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.3
      })
      .from(".bg-cover .description, .typed-subtitle", {
        y: 40,
        opacity: 0,
        duration: 0.7,
      }, "-=0.5")
      .from(".cover-btns a", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
      }, "-=0.3")
      .from(".cover-social-link a", {
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2");

    // 背景视差效果
    if (!isMobile()) {
      gsap.to(".bg-cover", {
        backgroundPositionY: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: ".index-cover, .bg-cover",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    // 滚动指示器动画
    gsap.to(".scroll-down", {
      y: -15,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "power1.inOut"
    });
  }

  // ============================================
  // 文章卡片滚动动画
  // ============================================

  function initCardAnimations() {
    const cards = gsap.utils.toArray(".article .card, .recommend .post-card");
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
      // 滚动进入动画
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: "power2.out",
        delay: (index % 3) * 0.08
      });

      // 3D悬停效果 (仅桌面端) - Awwwards 风格
      if (!isMobile()) {
        card.addEventListener("mousemove", function (e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -5; // 最大旋转角度
          const rotateY = ((x - centerX) / centerX) * 5;

          gsap.to(this, {
            perspective: 1000,
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            boxShadow: "0 30px 60px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)",
            duration: 0.4,
            ease: "power2.out"
          });
        });

        card.addEventListener("mouseleave", function () {
          gsap.to(this, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)", // 恢复默认柔和阴影
            duration: 0.6,
            ease: "elastic.out(1, 0.5)" // 如果不喜欢弹性，可用 power2.out
          });
        });

        // 卡片内部图片放大效果
        const cardImage = card.querySelector('.card-image img');
        if (cardImage) {
          card.addEventListener("mouseenter", function () {
            gsap.to(cardImage, {
              scale: 1.08,
              duration: 0.5,
              ease: "power2.out"
            });
          });

          card.addEventListener("mouseleave", function () {
            gsap.to(cardImage, {
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            });
          });
        }
      }
    });
  }

  // ============================================
  // 磁性按钮效果
  // ============================================

  function initMagneticButtons() {
    if (isMobile()) return;

    const magneticElements = document.querySelectorAll('.cover-btns a, .btn-floating, [data-magnetic]');

    magneticElements.forEach(btn => {
      const strength = parseFloat(btn.dataset?.magnetic) || 0.4; // 增强磁力
      const text = btn.querySelector('span, i'); // 如果有内部元素也一起移动

      btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // 按钮本体移动
        gsap.to(this, {
          x: x * strength,
          y: y * strength,
          duration: 0.3,
          ease: "power2.out"
        });

        // 内部元素移动更明显（视差感）
        if (text) {
          gsap.to(text, {
            x: x * (strength * 1.5),
            y: y * (strength * 1.5),
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(this, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)" // 更强的弹性回弹
        });

        if (text) {
          gsap.to(text, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
          });
        }
      });
    });
  }

  // ============================================
  // 阅读进度指示器
  // ============================================

  function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) return;

    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

    gsap.to(progressBar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      }
    });
  }

  // ============================================
  // 视差滚动效果
  // ============================================

  function initParallax() {
    if (isMobile()) return;

    // 首页卡片区域视差
    const indexCard = document.querySelector('#indexCard');
    if (indexCard) {
      gsap.from(indexCard, {
        y: 100,
        scrollTrigger: {
          trigger: indexCard,
          start: "top bottom",
          end: "top center",
          scrub: 1
        }
      });
    }

    // 梦想区块视差
    const dreamSection = document.querySelector('.dream');
    if (dreamSection) {
      gsap.from(dreamSection, {
        y: 50,
        opacity: 0.5,
        scrollTrigger: {
          trigger: dreamSection,
          start: "top 80%",
          end: "top 40%",
          scrub: 1
        }
      });
    }
  }

  // ============================================
  // 文字动画效果
  // ============================================

  function initTextAnimations() {
    // 标题渐入效果
    const animatedTitles = document.querySelectorAll('.dream .title, .recommend .title, .music-player .title');

    animatedTitles.forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    // 梦想文字打字效果
    const dreamText = document.querySelector('.dream .text');
    if (dreamText) {
      gsap.from(dreamText, {
        scrollTrigger: {
          trigger: dreamText,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      });
    }
  }

  // ============================================
  // 导航栏滚动效果
  // ============================================

  function initNavAnimation() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;

    ScrollTrigger.create({
      start: "top -100",
      onUpdate: (self) => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
          nav.classList.add('nav-scrolled');

          // 向下滚动隐藏，向上滚动显示
          if (currentScrollY > lastScrollY && currentScrollY > 300) {
            gsap.to(nav, { y: -100, duration: 0.3, ease: "power2.out" });
          } else {
            gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
          }
        } else {
          nav.classList.remove('nav-scrolled');
          gsap.to(nav, { y: 0, duration: 0.3 });
        }

        lastScrollY = currentScrollY;
      }
    });
  }

  // ============================================
  // 页面过渡动画
  // ============================================

  function initPageTransitions() {
    // 主内容区域进入动画
    const mainContent = document.querySelector('main.content');
    if (mainContent) {
      gsap.from(mainContent, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2
      });
    }

    // 图片懒加载动画
    const images = document.querySelectorAll('.card-image img, #articleContent img');
    images.forEach(img => {
      if (img.complete) {
        gsap.set(img, { opacity: 1 });
      } else {
        gsap.set(img, { opacity: 0 });
        img.addEventListener('load', function () {
          gsap.to(this, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      }
    });
  }

  // ============================================
  // 返回顶部按钮动画
  // ============================================

  function initBackToTop() {
    const backTopBtn = document.querySelector('#backTop');
    if (!backTopBtn) return;

    ScrollTrigger.create({
      start: "top -300",
      onEnter: () => {
        gsap.to(backTopBtn, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      },
      onLeaveBack: () => {
        gsap.to(backTopBtn, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        });
      }
    });

    // 悬停效果
    backTopBtn.addEventListener('mouseenter', function () {
      gsap.to(this, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    });

    backTopBtn.addEventListener('mouseleave', function () {
      gsap.to(this, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
  }

  // ============================================
  // 文章详情页动画
  // ============================================

  function initPostAnimations() {
    const artDetail = document.querySelector('#artDetail');
    if (!artDetail) return;

    // 文章卡片进入
    gsap.from(artDetail, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.3
    });

    // 文章信息区域
    gsap.from('#artDetail .article-info', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.5,
      ease: "power2.out"
    });

    // 文章内容段落逐个显示
    const paragraphs = document.querySelectorAll('#articleContent > p, #articleContent > h2, #articleContent > h3, #articleContent > ul, #articleContent > ol');
    paragraphs.forEach((p, i) => {
      gsap.from(p, {
        scrollTrigger: {
          trigger: p,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: Math.min(i * 0.05, 0.3),
        ease: "power2.out"
      });
    });
  }

  // ============================================
  // TOC 目录动画
  // ============================================

  function initTocAnimations() {
    const tocWidget = document.querySelector('.toc-widget');
    if (!tocWidget) return;

    gsap.from(tocWidget, {
      x: 50,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      ease: "power2.out"
    });

    // 目录项悬停效果
    const tocLinks = tocWidget.querySelectorAll('a');
    tocLinks.forEach(link => {
      link.addEventListener('mouseenter', function () {
        gsap.to(this, {
          x: 5,
          duration: 0.2,
          ease: "power2.out"
        });
      });
      link.addEventListener('mouseleave', function () {
        gsap.to(this, {
          x: 0,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }

  // ============================================
  // 标签云动画
  // ============================================

  function initTagCloudAnimation() {
    const tagChips = document.querySelectorAll('.article-tags .chip, .tag_share .chip');

    tagChips.forEach((chip, i) => {
      chip.addEventListener('mouseenter', function () {
        gsap.to(this, {
          scale: 1.1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      });
      chip.addEventListener('mouseleave', function () {
        gsap.to(this, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      });
    });
  }

  // ============================================
  // 关于页面动画
  // ============================================

  function initAboutAnimations() {
    const aboutContainer = document.querySelector('.about-container');
    if (!aboutContainer) return;

    // 清除 AOS 冲突，交由 GSAP 接管
    const aosElements = aboutContainer.querySelectorAll('[data-aos]');
    aosElements.forEach(el => {
      el.removeAttribute('data-aos');
      el.style.visibility = 'visible'; // 确保可见性
      el.classList.remove('aos-animate');
      el.classList.remove('aos-init');
    });

    // 头像动画
    const avatar = aboutContainer.querySelector('.avatar-img');
    if (avatar) {
      gsap.from(avatar, {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.3,
        clearProps: "all" // 动画结束后清理
      });
    }

    // 个人信息
    const authorInfo = aboutContainer.querySelector('.profile .author');
    if (authorInfo) {
      gsap.from(authorInfo, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out"
      });
    }

    // 统计数据
    const stats = aboutContainer.querySelectorAll('.post-statis');
    if (stats.length > 0) {
      gsap.from(stats, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        stagger: 0.2,
        ease: "power2.out"
      });
    }

    // 社交链接
    const socialLinks = aboutContainer.querySelectorAll('.social-link a');
    if (socialLinks.length > 0) {
      gsap.from(socialLinks, {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.7,
        ease: "back.out(1.7)"
      });
    }

    // 内容区域
    const intro = aboutContainer.querySelector('.introduction');
    if (intro) {
      gsap.from(intro, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: intro,
          start: "top 85%"
        },
        ease: "power2.out"
      });
    }
  }

  // ============================================
  // 可访问性检查
  // ============================================

  function checkAccessibility() {
    if (prefersReducedMotion()) {
      // 禁用所有动画
      gsap.globalTimeline.timeScale(20); // 加速完成而不是禁用
      ScrollTrigger.getAll().forEach(st => {
        st.animation?.progress(1);
      });
      console.log('Reduced motion preference detected - animations simplified');
      return false;
    }
    return true;
  }

  // ============================================
  // 初始化所有动画
  // ============================================

  function initAllAnimations() {
    if (!checkAccessibility()) return;

    // 核心动画
    initHeroAnimations();
    initCardAnimations();
    initMagneticButtons();
    initReadingProgress();
    initParallax();
    initTextAnimations();
    initNavAnimation();
    initPageTransitions();
    initBackToTop();
    initTagCloudAnimation();

    // 页面特定动画
    initPostAnimations();
    initTocAnimations();
    initAboutAnimations();

    console.log('✨ GSAP animations initialized');
  }

  // ============================================
  // DOM Ready 启动
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }

  // 窗口调整时刷新
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

})();
