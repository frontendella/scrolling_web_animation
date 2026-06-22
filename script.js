document.addEventListener('DOMContentLoaded', () => {
    const servicesData = {
      'front-end-services': [
        'Creative development',
        'Animation',
        'Landing pages',
        'Performance optimization',
        'Performance optimization',
        'Animation'
      ],
      'back-end-services': [
        'Back end structures',
        'Content management systems',
        'User authentication',
        'Remote updating',
        'Cloud storage',
        'Hosting'
      ]
    };
  
    for (const categoryId in servicesData) {
      const accordionList = document.querySelector(`#${categoryId} .accordion-list`);
      if (accordionList) {
        accordionList.innerHTML = servicesData[categoryId].map(item => `
          <div class="accordion-item">
            <div class="accordion-header">
              <span>${item}</span>
              <span class="icon">+</span>
            </div>
            <div class="accordion-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a odio eget massa semper rutrum nec eget neque.</p>
            </div>
          </div>
        `).join('');
      }
    }
  

    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.icon');
        const isOpen = item.classList.contains('active');
  

        document.querySelectorAll('.accordion-item.active').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
            otherItem.querySelector('.icon').textContent = '+';
          }
        });
  

        if (!isOpen) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          icon.textContent = '−';
        } else {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
          icon.textContent = '+';
        }
      });
    });
  

    const serviceSections = document.querySelectorAll('.service-category');
    const titlePartWordSpans = document.querySelectorAll('.title-part-word span');
    const numberContainer = document.querySelector('.number-container');
    const pageNumbers = document.querySelectorAll('.page-number');
    const headerElement = document.querySelector('header');
  
    let currentSection = 'front-end-services';
    let isResizing = false;
    let resizeTimeout;
  
    const handleSectionChange = (newSectionId, animate = true) => {
      if (currentSection === newSectionId && !isResizing) return;
      currentSection = newSectionId;
  
      const isFrontend = currentSection === 'front-end-services';
      const isMobile = window.innerWidth <= 900;
  
      if (isMobile) {
        const titleSpan = document.querySelector('.title-part-word span[data-title-section="front-end"]');
        if (titleSpan) {
          titleSpan.textContent = isFrontend ? 'FRONT' : 'BACK';
          titleSpan.style.display = 'block';
        }
        const backSpan = document.querySelector('.title-part-word span[data-title-section="back-end"]');
        if (backSpan) backSpan.style.display = 'none';
        if (numberContainer) numberContainer.style.display = 'none';
      } else {
        const frontSpan = document.querySelector('.title-part-word span[data-title-section="front-end"]');
        const backSpan = document.querySelector('.title-part-word span[data-title-section="back-end"]');
        if (frontSpan) {
          frontSpan.textContent = 'FRONT';
          frontSpan.style.display = 'block';
        }
        if (backSpan) {
          backSpan.textContent = 'BACK';
          backSpan.style.display = 'block';
        }
  
        titlePartWordSpans.forEach(span => {
          span.style.transition = animate ? 'transform 0.8s cubic-bezier(0.1, 1, 0.3, 1)' : 'none';
          if (span.dataset.titleSection === 'front-end') {
            span.style.transform = isFrontend ? 'translateY(0%) scaleY(0.9)' : 'translateY(-100%) scaleY(0.9)';
          } else {
            span.style.transform = isFrontend ? 'translateY(100%) scaleY(0.9)' : 'translateY(0%) scaleY(0.9)';
          }
        });
  
        if (numberContainer) numberContainer.style.display = 'block';
  
        pageNumbers.forEach(num => {
          num.style.transition = animate ? 'transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)' : 'none';
          if (num.dataset.numberSection === 'front-end') {
            num.style.transform = isFrontend ? 'translateY(0%) scaleY(0.9)' : 'translateY(-100%) scaleY(0.9)';
          } else {
            num.style.transform = isFrontend ? 'translateY(100%) scaleY(0.9)' : 'translateY(0%) scaleY(0.9)';
          }
        });
      }
    };
  

    const mainTitleObserver = new IntersectionObserver(entries => {
      if (isResizing) return;
  
      const headerHeight = headerElement.offsetHeight;
      const stickyPoint = headerHeight;
      let newActiveSection = currentSection;
  
      entries.forEach(entry => {
        const rect = entry.boundingClientRect;
        const targetId = entry.target.id;
  
        if (targetId === 'back-end-services') {
          if (rect.top <= stickyPoint + 1 && rect.bottom > stickyPoint + 1) {
            newActiveSection = 'back-end-services';
          } else if (rect.bottom <= stickyPoint + 1 && currentSection === 'back-end-services') {
            newActiveSection = 'front-end-services';
          }
        } else if (targetId === 'front-end-services') {
          const backEndSection = document.getElementById('back-end-services');
          const backEndRect = backEndSection.getBoundingClientRect();
          if (entry.isIntersecting && backEndRect.top > stickyPoint + 1) {
            newActiveSection = 'front-end-services';
          }
        }
      });
  
      if (newActiveSection !== currentSection) {
        handleSectionChange(newActiveSection);
      }
    }, {
      rootMargin: `-${headerElement.offsetHeight}px 0px 0px 0px`,
      threshold: [0, 0.01, 0.99, 1]
    });
  
    serviceSections.forEach(section => mainTitleObserver.observe(section));
  

    const itemRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px'
    });
  
    document.querySelectorAll('.accordion-item').forEach(item => {
      itemRevealObserver.observe(item);
    });
  

    const initializeLayout = () => {
      isResizing = true;
      clearTimeout(resizeTimeout);
  
      const isMobile = window.innerWidth <= 900;
      let activeSectionId = 'front-end-services';
      const backEndSection = document.getElementById('back-end-services');
      const backEndRect = backEndSection.getBoundingClientRect();
      const headerHeight = headerElement.offsetHeight;
      const stickyPoint = headerHeight;
  
      if (!isMobile && backEndRect.top <= stickyPoint + 5 && backEndRect.bottom > stickyPoint) {
        activeSectionId = 'back-end-services';
      } else {
        for (const section of serviceSections) {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            activeSectionId = section.id;
            break;
          }
        }
      }
  
      currentSection = activeSectionId;
      handleSectionChange(currentSection, false);
  
      resizeTimeout = setTimeout(() => {
        isResizing = false;
        handleSectionChange(currentSection, true);
      }, 300);
    };
  
    initializeLayout();
    window.addEventListener('resize', initializeLayout);
  });
  