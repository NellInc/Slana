(function() {
  'use strict';

  function initProgressiveImageLoading() {
    const bannerWrapper = document.querySelector('.banner-thumbnail-wrapper figure');
    const bannerImg = bannerWrapper ? bannerWrapper.querySelector('img') : null;
    
    if (!bannerImg || !bannerImg.src) return;
    
    if (bannerImg.src.includes('SlanaBannerSmaller.jpg') || 
        (bannerImg.dataset.src && bannerImg.dataset.src.includes('SlanaBannerSmaller.jpg'))) {
      
      const highQualitySrc = bannerImg.src || bannerImg.dataset.src;
      const lowQualitySrc = highQualitySrc.replace(/\.jpg$/, '-lq.jpg');
      
      const placeholder = new Image();
      placeholder.className = 'progressive-placeholder';
      placeholder.style.cssText = bannerImg.style.cssText;
      placeholder.style.filter = 'blur(10px)';
      placeholder.style.transform = 'scale(1.05)';
      placeholder.style.transition = 'opacity 0.5s ease-out';
      
      bannerImg.style.opacity = '0';
      bannerImg.style.transition = 'opacity 0.5s ease-in';
      
      placeholder.onload = function() {
        bannerWrapper.appendChild(placeholder);
        
        const highQualityImg = new Image();
        highQualityImg.onload = function() {
          bannerImg.src = highQualitySrc;
          bannerImg.style.opacity = '1';
          
          if (bannerWrapper.classList.contains('loading')) {
            bannerWrapper.classList.remove('loading');
          }
          
          setTimeout(function() {
            placeholder.style.opacity = '0';
            setTimeout(function() {
              if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
              }
            }, 500);
          }, 100);
        };
        
        highQualityImg.onerror = function() {
          bannerImg.style.opacity = '1';
          if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
          }
        };
        
        highQualityImg.src = highQualitySrc;
      };
      
      placeholder.onerror = function() {
        bannerImg.style.opacity = '1';
      };
      
      placeholder.src = lowQualitySrc;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgressiveImageLoading);
  } else {
    setTimeout(initProgressiveImageLoading, 100);
  }

  if (window.Y) {
    Y.on('domready', function() {
      setTimeout(initProgressiveImageLoading, 500);
    });
  }
})();