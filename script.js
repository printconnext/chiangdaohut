/* Chiang Dao Hut Web Interactions */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Navbar Scroll & Section Highlighting
    // ==========================================================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Active Nav Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle of screen
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));

    // Smooth scroll for nav links with offset for sticky header
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('open');
                menuToggle.classList.remove('active');
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Mobile Navigation Drawer Toggle
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    });

    // ==========================================================================
    // Modal Management (About, Menu, Bookings)
    // ==========================================================================
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        }
    }
    
    function closeModal(modal) {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Resume scrolling
    }
    
    // Wire close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking background overlay
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
    
    // Esc key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlays.forEach(overlay => {
                if (overlay.classList.contains('open')) {
                    closeModal(overlay);
                }
            });
            if (lightbox.classList.contains('open')) {
                closeLightbox();
            }
        }
    });

    // About More Modal trigger
    const aboutBtn = document.getElementById('btn-about-more');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            openModal('about-modal');
        });
    }

    // View All Menu Modal trigger
    const viewMenuBtn = document.getElementById('btn-view-menu');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            openModal('menu-modal');
        });
    }

    // Menu Tab Switching
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const tabPanes = document.querySelectorAll('.menu-tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCategory = btn.getAttribute('data-category');
            
            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle panes
            tabPanes.forEach(pane => {
                const paneId = pane.getAttribute('id');
                if (paneId === `tab-${targetCategory}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // Recommended items "Plus" triggers Booking/Order inquiry
    const addMenuBtns = document.querySelectorAll('.menu-add-btn');
    addMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.menu-card');
            const itemName = card.querySelector('.menu-title-en').textContent;
            
            // Open booking modal to order
            const bookingTitle = document.getElementById('booking-title');
            const bookingServiceInput = document.getElementById('booking-service');
            const guestsGroup = document.getElementById('guests-group');
            
            bookingTitle.textContent = `สั่งซื้อ / สั่งเครื่องดื่ม`;
            bookingServiceInput.value = `Menu Order: ${itemName}`;
            if (guestsGroup) guestsGroup.style.display = 'none'; // hide guest input for food order
            
            openModal('booking-modal');
        });
    });

    // Stays & Tours Booking trigger
    const bookingButtons = document.querySelectorAll('.btn-book, .btn-buy-honey');
    bookingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service') || btn.getAttribute('data-product');
            const bookingTitle = document.getElementById('booking-title');
            const bookingServiceInput = document.getElementById('booking-service');
            const guestsGroup = document.getElementById('guests-group');
            
            if (btn.classList.contains('btn-buy-honey')) {
                bookingTitle.textContent = `สั่งซื้อสินค้าสินค้าชุมชน`;
                if (guestsGroup) guestsGroup.style.display = 'none';
            } else {
                bookingTitle.textContent = `จองบริการท่องเที่ยว / ที่พัก`;
                if (guestsGroup) guestsGroup.style.display = 'block';
            }
            
            bookingServiceInput.value = serviceName;
            
            // Auto pre-populate date with tomorrow's date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            document.getElementById('booking-date').value = tomorrowStr;
            
            openModal('booking-modal');
        });
    });

    // ==========================================================================
    // Lightbox Gallery
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentGalleryIndex = 0;
    
    function openLightbox(index) {
        currentGalleryIndex = index;
        const item = galleryItems[index];
        const src = item.getAttribute('data-src') || item.querySelector('img').getAttribute('src');
        const captionText = item.querySelector('img').getAttribute('alt');
        
        lightboxImg.src = src;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    function showNextImage() {
        let nextIndex = currentGalleryIndex + 1;
        if (nextIndex >= galleryItems.length) {
            nextIndex = 0;
        }
        openLightbox(nextIndex);
    }
    
    function showPrevImage() {
        let prevIndex = currentGalleryIndex - 1;
        if (prevIndex < 0) {
            prevIndex = galleryItems.length - 1;
        }
        openLightbox(prevIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // ==========================================================================
    // Form Submission & Verification Alerts
    // ==========================================================================
    
    // Contact Form Submit
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Form visual success notification
        showToast('success', `ขอบคุณค่ะ คุณ ${name}! ทางเราได้รับข้อความติดต่อแล้ว เจ้าหน้าที่จะตอบกลับไปโดยเร็วที่สุด`);
        contactForm.reset();
    });

    // Booking Form Submit
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('booking-name').value;
        const phone = document.getElementById('booking-phone').value;
        const date = document.getElementById('booking-date').value;
        const service = document.getElementById('booking-service').value;
        
        // Close booking modal
        const bookingModal = document.getElementById('booking-modal');
        closeModal(bookingModal);
        
        // Show confirmation alert
        showToast('success', `การจองสำเร็จ! ทางเราได้รับการจองสำหรับ "${service}" วันที่ ${date} แล้ว เจ้าหน้าที่จะโทรติดต่อกลับที่เบอร์ ${phone} เพื่อแจ้งรายละเอียดยืนยันค่ะ`);
        bookingForm.reset();
    });

    // Simple customized toast notification helper
    function showToast(type, text) {
        const toast = document.createElement('div');
        toast.className = `toast-alert ${type}`;
        
        // Styles for toast alert directly added to body
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.backgroundColor = '#1E3A2B';
        toast.style.color = '#FAF3E8';
        toast.style.padding = '18px 24px';
        toast.style.borderRadius = '12px';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        toast.style.zIndex = '5000';
        toast.style.maxWidth = '380px';
        toast.style.borderLeft = '6px solid #D85A0E';
        toast.style.fontFamily = 'var(--font-thai)';
        toast.style.fontSize = '0.9rem';
        toast.style.lineHeight = '1.5';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.4s ease';
        
        toast.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:12px;">
                <i class="fas fa-check-circle" style="color:#D85A0E; font-size:1.3rem; margin-top:2px;"></i>
                <div>
                    <strong style="display:block; margin-bottom:4px; font-weight:700; color:#FFFFFF;">ส่งข้อมูลสำเร็จ</strong>
                    <span>${text}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger reflow & animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Disappear after 6 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 6000);
    }
});
