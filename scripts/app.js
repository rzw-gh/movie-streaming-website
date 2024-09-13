document.addEventListener('DOMContentLoaded', function () {
    ////HANDLE THEME TOGGLE////
    const theme = localStorage.getItem('theme') || 'dark';
    const toggleThemeButton = document.getElementById('toggle-theme');
    const useElement = toggleThemeButton.querySelector('use');

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        useElement.setAttribute('href', '#sun');
    } else {
        document.documentElement.classList.remove('dark')
        useElement.setAttribute('href', '#moon');
    }

    toggleThemeButton.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        const currentIcon = useElement.getAttribute('href');

        if (currentIcon === '#sun') {
            useElement.setAttribute('href', '#moon');
            localStorage.setItem('theme', 'light');
        } else {
            useElement.setAttribute('href', '#sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    ////HANDLE THEME TOGGLE////

    ////HANDLE MOBILE MENU OPEN/CLOSE////
    const mobileMenu = document.querySelector("#mobile-menu")
    const mobileMenuOpenBtn = document.querySelector("#mobile-menu-open-btn")
    const mobileMenuCloseBtn = document.querySelector("#mobile-menu-close-btn")

    mobileMenuOpenBtn.addEventListener("click", (e) => {
        mobileMenu.classList.remove("-right-64")
        mobileMenu.classList.add("right-0")
    })
    mobileMenuCloseBtn.addEventListener("click", (e) => {
        mobileMenu.classList.remove("right-0")
        mobileMenu.classList.add("-right-64")
    })
    ////HANDLE MOBILE MENU OPEN/CLOSE////

    ////HANDLE MOBILE SUBMENU TOGGLE////
    const submenu = document.querySelector(".submenu-mobile")
    const submenuOpenBtn = document.querySelector(".submenu-mobile-open-btn")

    submenuOpenBtn.addEventListener("click", (e) => {
        submenu.classList.toggle("submenu-mobile--close")
        submenuOpenBtn.classList.toggle("rotate-90")
    })
    ////HANDLE MOBILE SUBMENU TOGGLE////

    ////HANDLE Tabs////
    const tabs = document.getElementsByClassName("af-tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function (e) {
            /// TOGGLE TAB ACTIVE ///
            for (let it = 0; it < tabs.length; it++) {
                if (tabs[it].classList.contains("af-tab-active")) {
                    tabs[it].classList.remove("af-tab-active");
                }
                if (!tabs[it].classList.contains("af-tab-normal")) {
                    tabs[it].classList.add("af-tab-normal");
                }
            }
            this.classList.add("af-tab-active");
            this.classList.remove("af-tab-normal");

            /// TOGGLE TAB CONTENT VISIBILITY ///
            const tabContents = document.getElementsByClassName("tab-content");
            for (let ic = 0; ic < tabContents.length; ic++) {
                tabContents[ic].classList.add("hidden");
                tabContents[ic].classList.remove("opacity-100");
                tabContents[ic].classList.add("opacity-0");
            }
            let contentTargetID = this.getAttribute('data-tab');
            document.getElementById(contentTargetID).classList.remove("hidden");
            document.getElementById(contentTargetID).classList.remove("opacity-0");
            document.getElementById(contentTargetID).classList.add("opacity-100");
        });
    }
    ////HANDLE Tabs////

    ///HANDLE ACCORDIONS///
    document.querySelectorAll('.af-accordion').forEach(accordion => {
        accordion.addEventListener('click', () => {
            const targetId = accordion.getAttribute('data-accordion-target');
            const targetContent = document.querySelector(`#${targetId}`);

            targetContent.classList.toggle('hidden');
            targetContent.classList.toggle('flex');

            accordion.querySelector('svg').classList.toggle("rotate-180");

            // If content is open, close it
            if (targetContent.classList.contains('af-accordion-content--open')) {
                targetContent.style.maxHeight = '0px';
                targetContent.classList.remove('af-accordion-content--open');
                targetContent.classList.add('af-accordion-content--close');
            } else {
                // Close all other open contents
                document.querySelectorAll('.accordion-content--open').forEach(openContent => {
                    targetContent.style.maxHeight = '0px';
                    openContent.classList.remove('af-accordion-content--open');
                    openContent.classList.add('af-accordion-content--close');
                });

                // Open the clicked content
                targetContent.classList.add('af-accordion-content--open');
                targetContent.classList.remove('af-accordion-content--close');
                targetContent.style.maxHeight = targetContent.scrollHeight + 'px'; // Set to the actual height
            }
        });
    });
    ///HANDLE ACCORDIONS///

    ///HANDLE SLIDER///
    function initializeCarousels() {
        const carousels = document.querySelectorAll('.af-carousel');
        carousels.forEach((carousel, index) => {
            let carouselID = carousel.getAttribute('data-carousel')
            initiateSingleSlider(carousel, carouselID, index);
        });
    }

    function initiateSingleSlider(carousel, carouselID, index) {
        const bodyDirection = document.documentElement.getAttribute('dir');
        const slides = carousel.children;
        let slidesGap;

        if (bodyDirection === "ltr") {
            const child1RightEdge = slides[0].getBoundingClientRect().right;
            const child2LeftEdge = slides[1].getBoundingClientRect().left;
            slidesGap = Math.abs(child2LeftEdge - child1RightEdge);
        } else {
            const child1LeftEdge = slides[0].getBoundingClientRect().left;
            const child2RightEdge = slides[1].getBoundingClientRect().right;
            slidesGap = Math.abs(child2RightEdge - child1LeftEdge);
        }

        const itemWidth = slides[0].clientWidth;
        const slideWidthPercentage = ((itemWidth + slidesGap) / carousel.clientWidth) * 100;
        const gapWidthPercentage = (slidesGap / carousel.clientWidth) * 100;
        const totalSlides = slides.length;
        const totalWidthPercentage = slideWidthPercentage * totalSlides - gapWidthPercentage;
        const visibleSlides = carousel.clientWidth / (itemWidth + slidesGap);

        const nextButton = document.querySelector("#"+carouselID+"-next");
        const prevButton = document.querySelector("#"+carouselID+"-prev");
        if (slides.length <= visibleSlides) {
            nextButton.classList.add("hidden");
            prevButton.classList.add("hidden");
        } else {
            let currentTranslation = 0;
            nextButton.addEventListener('click', () => {
                if (bodyDirection === "rtl") {
                    if (currentTranslation < (totalWidthPercentage - slideWidthPercentage * visibleSlides)) {
                        currentTranslation += slideWidthPercentage;
                        if (currentTranslation > (totalWidthPercentage - slideWidthPercentage * visibleSlides)) {
                            currentTranslation = (totalWidthPercentage - slideWidthPercentage * visibleSlides);
                        }
                        console.log(currentTranslation)
                        carousel.style.transform = `translateX(${currentTranslation}%)`;
                    }
                } else {
                    if (currentTranslation > -(totalWidthPercentage - slideWidthPercentage * visibleSlides)) {
                        currentTranslation -= slideWidthPercentage;
                        if (currentTranslation < -(totalWidthPercentage - slideWidthPercentage * visibleSlides)) {
                            currentTranslation = -(totalWidthPercentage - slideWidthPercentage * visibleSlides);
                        }
                        carousel.style.transform = `translateX(${currentTranslation}%)`;
                    }
                }
                updateButtons();
            });

            prevButton.addEventListener('click', () => {
                const translateValue = slideWidthPercentage;
                if (bodyDirection === "rtl") {
                    if (currentTranslation > 0) {
                        currentTranslation -= translateValue;
                        if (currentTranslation < 0) {
                            currentTranslation = 0;
                        }
                        carousel.style.transform = `translateX(${currentTranslation}%)`;
                    }
                } else {
                    if (currentTranslation < 0) {
                        currentTranslation += translateValue;
                        if (currentTranslation > 0) {
                            currentTranslation = 0;
                        }
                        carousel.style.transform = `translateX(${currentTranslation}%)`;
                    }
                }
                updateButtons();
            });

            function updateButtons() {
                if (bodyDirection === "rtl") {
                    prevButton.disabled = currentTranslation <= 0;
                    prevButton.style.cursor = currentTranslation <= 0 ? "not-allowed" : "pointer";
                    nextButton.disabled = currentTranslation >= (totalWidthPercentage - slideWidthPercentage * visibleSlides);
                    nextButton.style.cursor = currentTranslation >= (totalWidthPercentage - slideWidthPercentage * visibleSlides) ? "not-allowed" : "pointer";
                } else {
                    prevButton.disabled = currentTranslation >= 0;
                    prevButton.style.cursor = currentTranslation >= 0 ? "not-allowed" : "pointer";
                    nextButton.disabled = currentTranslation <= -(totalWidthPercentage - slideWidthPercentage * visibleSlides);
                    nextButton.style.cursor = currentTranslation <= -(totalWidthPercentage - slideWidthPercentage * visibleSlides) ? "not-allowed" : "pointer";
                }
            }

            updateButtons();
        }
    }

    initializeCarousels();
    ///HANDLE SLIDER///

    ///HANDLE INFINITE SLIDER///
    const containers = document.querySelectorAll('.af-infinite-scroll-container');

    containers.forEach(container => {
        const content = container.querySelector('.af-infinite-scroll-content');
        let slider_speed;
        const speedClass = content.className.split(' ').find(cls => cls.startsWith('af-scroll-speed-'));
        if (speedClass) {
            slider_speed = parseInt(speedClass.split('-').pop(), 10) / 2;
        } else {
            slider_speed = 1
        }

        // Clone the content for seamless looping
        content.innerHTML += content.innerHTML;

        let scrollHeight = content.scrollHeight / 2;
        let scrollPos = 0;
        let scrolling;

        function step() {
            if (content.classList.contains("af-scroll-reverse")) {
                scrollPos -= slider_speed; // Adjust this value to change scroll speed
                if (scrollPos <= 0) {
                    scrollPos = scrollHeight;
                }
            } else {
                scrollPos += slider_speed; // Adjust this value to change scroll speed
                if (scrollPos >= scrollHeight) {
                    scrollPos = 0;
                }
            }
            content.style.transform = `translateY(-${scrollPos}px)`;
            scrolling = requestAnimationFrame(step);
        }

        // Start the animation
        scrolling = requestAnimationFrame(step);

        // Pause on mouse enter
        container.addEventListener('mouseenter', () => {
            cancelAnimationFrame(scrolling);
        });

        // Resume on mouse leave
        container.addEventListener('mouseleave', () => {
            scrolling = requestAnimationFrame(step);
        });

        // Recalculate dimensions on window resize
        window.addEventListener('resize', () => {
            scrollHeight = content.scrollHeight / 2;
        });

        // Function to add new items dynamically
        function addItem(imageSrc) {
            const newItem = document.createElement('div');
            newItem.className = 'w-[200px] h-[300px]';
            newItem.innerHTML = `<img src="${imageSrc}" class="rounded-xl bg-cover" alt="poster">`;
            content.appendChild(newItem);

            // Clone the new item for seamless looping
            const clonedItem = newItem.cloneNode(true);
            content.appendChild(clonedItem);

            // Recalculate scroll height
            scrollHeight = content.scrollHeight / 2;
        }

        // Example usage of addItem function
        // addItem('images/show/posters/new-poster.png');

        // Attach addItem function to the container for external access
        container.addItem = addItem;
    });
    ///HANDLE INFINITE SLIDER///

    ///HANDLE SHOW CARD OVERLAY DIRECTION///
    document.querySelectorAll('.show-card').forEach(showCard => {
        showCard.addEventListener('mouseenter', function () {
            const hoverCard = this.querySelector('.show-overlay-card');
            const cardRect = this.getBoundingClientRect();
            const hoverCardWidth = hoverCard.offsetWidth;

            // Calculate space available on the left and right of the main card
            const spaceOnLeft = cardRect.left - 50;
            const spaceOnRight = window.innerWidth - cardRect.right;

            // Adjust hover card position if necessary
            if (spaceOnRight < hoverCardWidth) {
                hoverCard.style.transform = 'translate(-67%, -12%)'; // Move to the right
            } else {
                hoverCard.style.transform = 'translate(100%, -12%)'; // Default left position
            }
        });

        showCard.addEventListener('mouseleave', function () {
            const hoverCard = this.querySelector('.show-overlay-card');
            // Reset transform to the default when not hovering
            hoverCard.style.transform = 'translate(17%, -12%)';
        });
    });
    ///HANDLE SHOW CARD OVERLAY DIRECTION///

    ///HANDLE SPOIL BUTTON OVERLAY///
    document.querySelectorAll('.hide-spoil-overlay').forEach(button => {
        button.addEventListener('click', function () {
            const spoilOverlay = this.closest('.spoil-overlay');
            if (spoilOverlay) {
                spoilOverlay.style.opacity = "0";
                spoilOverlay.classList.add("hidden");
            }
        });
    });
    ///HANDLE SPOIL BUTTON OVERLAY///

    ///HANDLE SCROLL TOP BUTTON///
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    ///HANDLE SCROLL TOP BUTTON///

    ///HANDLE SUB-REVIEWS CLOSE & EXPAND///
    let close_review_buttons = document.querySelectorAll('.close-review-button')
    close_review_buttons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewsWrapper = this.closest('.sub-review-wrapper');
            let subReviews = Array.from(reviewsWrapper.querySelectorAll('.sub-review'));
            let hiddenCount = 0;
            let visibleCount = 0;

            for (let i = 0; i < subReviews.length; i++) {
                if (subReviews[i].classList.contains('flex')) {
                    visibleCount++;
                }
            }

            if (visibleCount > 2) {
                for (let i = subReviews.length - 1; i >= 0; i--) {
                    if (!subReviews[i].classList.contains('hidden') && hiddenCount < 2) {
                        subReviews[i].classList.add('hidden');
                        subReviews[i].classList.remove('flex');
                        hiddenCount++;
                    } else {
                        visibleCount = 0
                        let subReviews = Array.from(reviewsWrapper.querySelectorAll('.sub-review'))
                        for (let i = 0; i < subReviews.length; i++) {
                            if (subReviews[i].classList.contains('flex')) {
                                visibleCount++;
                            }
                        }
                        if (visibleCount >= 2) {
                            document.querySelector('.close-review-button').style.cursor = "not-allowed"
                        }
                    }
                }
            }

            document.querySelector('.expand-review-button').style.cursor = "pointer"
        });
    });

    let expand_review_buttons = document.querySelectorAll('.expand-review-button')
    expand_review_buttons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewsWrapper = this.closest('.sub-review-wrapper');
            const subReviews = Array.from(reviewsWrapper.querySelectorAll('.sub-review'));
            let hiddenCount = 0;
            let visibleCount = 0;

            for (let i = 0; i < subReviews.length; i++) {
                if (subReviews[i].classList.contains('hidden')) {
                    hiddenCount++;
                }
            }

            if (hiddenCount >= 2) {
                for (let i = subReviews.length - 1; i >= 0; i--) {
                    if (subReviews[i].classList.contains('hidden') && visibleCount < 2) {
                        subReviews[i].classList.remove('hidden');
                        subReviews[i].classList.add('flex');
                        visibleCount++;
                    } else {
                        hiddenCount = 0
                        let subReviews = Array.from(reviewsWrapper.querySelectorAll('.sub-review'))
                        for (let i = 0; i < subReviews.length; i++) {
                            if (subReviews[i].classList.contains('hidden')) {
                                hiddenCount++;
                            }
                        }
                        if (hiddenCount < 2) {
                            document.querySelector('.expand-review-button').style.cursor = "not-allowed"
                        }
                    }
                }
            }

            document.querySelector('.close-review-button').style.cursor = "pointer"
        });
    });
    ///HANDLE SUB-REVIEWS CLOSE & EXPAND///

    ///HANDLE DROPDOWNS///
    const dropdowns = document.querySelectorAll('.af-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const targetId = dropdown.getAttribute('data-dropdown-target');
            const targetContent = document.querySelector(`#${targetId}`);

            targetContent.classList.toggle('hidden');
            targetContent.classList.toggle('flex');
        });
        dropdown.addEventListener('mouseleave', () => {
            const targetId = dropdown.getAttribute('data-dropdown-target');
            const targetContent = document.querySelector(`#${targetId}`);

            targetContent.classList.toggle('hidden');
            targetContent.classList.toggle('flex');
        });
    });
    ///HANDLE DROPDOWNS///

    ///HANDLE SKELETON PRELOADER///
    setTimeout(() => {
        const skeletonPreLoaders = document.querySelectorAll('.af-skeleton-preloader');
        skeletonPreLoaders.forEach(loader => {
            loader.classList.add("hidden")
        })
        document.querySelector("main").classList.remove("hidden")
    }, 1000);
    ///HANDLE SKELETON PRELOADER///

    ///GLOBAL///
    let tab_related_shows = document.querySelector('[data-tab="tab-related_shows"]')
    if (tab_related_shows) {
        tab_related_shows.addEventListener('click', function () {
            initializeCarousels()
        });
    }
    ///GLOBAL///
});
