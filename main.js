const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const STORAGE_KEY_PLAYER = 'SETTING_MUSICPLAYER'

const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playbtn = $('.btn-toggle-play')
const player = $('.player')
const nextbtn =$('.btn-next')
const backbtn = $('.btn-prev')
const progressbar = $('#progress')
const randombtn = $('.btn-random')
const repeatbtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex:  0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    settings: JSON.parse(localStorage.getItem(STORAGE_KEY_PLAYER)) || {},
    songs: [
        { 
            name: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU', 
            singer: 'Sơn Tùng MTP', 
            path: './asset/Music/ĐỪNG LÀM TRÁI TIM ANH ĐAUSƠN TÙNG MTP.mp3', 
            image:'./asset/thumbnail/dunglamtraitimanhdau.png'
        },
        { 
            name: 'Đường Tôi Chở Em Về', 
            singer: 'BuiTruongLinh', 
            path: './asset/Music/Đường Tôi Chở Em Về  buitruonglinh.mp3', 
            image:'./asset/thumbnail/duongtoichoemve.png'
        },
        { 
            name: 'Sanctuary', 
            singer: 'Joji', 
            path: './asset/Music/Sanctuary  Joji.mp3',
            image:'./asset/thumbnail/santruary.png'
        },
        { 
            name: 'Where Were You In The Morning', 
            singer: 'Shaun Mendes', 
            path: './asset/Music/Where Were You In The Morning Shaun Mendes.mp3',
            image:'./asset/thumbnail/wherewereyouinthemorning.png'
        },
        { 
            name: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU', 
            singer: 'Sơn Tùng MTP', 
            path: './asset/Music/ĐỪNG LÀM TRÁI TIM ANH ĐAUSƠN TÙNG MTP.mp3', 
            image:'./asset/thumbnail/dunglamtraitimanhdau.png'
        },
        { 
            name: 'Sanctuary', 
            singer: 'Joji', 
            path: './asset/Music/Sanctuary  Joji.mp3',
            image:'./asset/thumbnail/santruary.png'
        },
        { 
            name: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU', 
            singer: 'Sơn Tùng MTP', 
            path: './asset/Music/ĐỪNG LÀM TRÁI TIM ANH ĐAUSƠN TÙNG MTP.mp3', 
            image:'./asset/thumbnail/dunglamtraitimanhdau.png'
        },
        { 
            name: 'Đường Tôi Chở Em Về', 
            singer: 'BuiTruongLinh', 
            path: './asset/Music/Đường Tôi Chở Em Về  buitruonglinh.mp3', 
            image:'./asset/thumbnail/duongtoichoemve.png'
        },
        { 
            name: 'Sanctuary', 
            singer: 'Joji', 
            path: './asset/Music/Sanctuary  Joji.mp3',
            image:'./asset/thumbnail/santruary.png'
        },
        { 
            name: 'Where Were You In The Morning', 
            singer: 'Shaun Mendes', 
            path: './asset/Music/Where Were You In The Morning Shaun Mendes.mp3',
            image:'./asset/thumbnail/wherewereyouinthemorning.png'
        },
    ],
    setConfig: function(key, value){
        //this.config[key] = value;
        // localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(this.config))
    },

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function(){
        const cdwidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrolly = window.scrollY; //|| document.documentElement.scrollTop
            //console.log(cdwidth); 
            //console.log(scrolly);
            const newcdwidth = cdwidth - scrolly;
           // console.log(newcdwidth);
            cd.style.width = newcdwidth > 0 ? newcdwidth + 'px' : 0 + 'px';
            cd.style.opacity = newcdwidth / cdwidth;
        }
        playbtn.onclick = function(){
            if (app.isPlaying){  
                audio.pause()
                
            } else{
                audio.play()
            }
        }
        audio.onplay = function(){
            app.isPlaying = true; 
            player.classList.add('playing')
            cdthumb_ani.play()
        }
        audio.onpause = function(){
            app.isPlaying = false; 
            player.classList.remove('playing')
            cdthumb_ani.pause()
        }
        audio.ontimeupdate = function(){
            if (audio.duration){
                const progressbar = audio.currentTime / audio.duration * 100;
                progress.value = progressbar
            }
        }
        progress.onchange = function(e){
            const percentage = e.target.value / 100 * audio.duration
            audio.currentTime = percentage 
        }

        nextbtn.onclick = function(){
            if (app.isRandom){
                app.shuffleSong()
            }else{
                app.nextSong();
            }
            cdthumb_ani.play()
            audio.play()
            app.render()
            app.scrolltoActiveSong()
        }

        backbtn.onclick = function(){
            if (app.isRandom){
                app.shuffleSong()
            }else{
                app.prevSong();
            }
            cdthumb_ani.play()
            audio.play()
            app.render()
            app.scrolltoActiveSong() 
        }

        const cdthumb_ani = cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity,
        })
        cdthumb_ani.pause()

        randombtn.onclick = function(){
            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom)
            this.classList.toggle('active');
        }
        repeatbtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            this.classList.toggle('active');
        }
        audio.onended = function(){
            if (app.isRandom){
                app.shuffleSong()
                cdthumb_ani.play()
                audio.play()
            }else if(app.isRepeat){
                app.repeatSong()
                cdthumb_ani.play()
                audio.play()
            }else{
                app.nextSong();
                cdthumb_ani.play()
                audio.play()
            }
        }
        playlist.onclick = function(e){
            const songnode = e.target.closest('.song:not(.active)')
            if(songnode || e.target.closest('.option')){
                if (songnode){
                    app.currentIndex =  Number(songnode.getAttribute('data-index')) //Number(songnode.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }
            }
        }        
    },
    shuffleSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex )
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    repeatSong: function(){
        this.loadCurrentSong();
    },

    loadCurrentSong: function(){
        heading.innerText = this.currentSong.name
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    scrolltoActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end',
            })
        }, 100)
    },
    start: function () {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        // console.log([playbtn])
    }
}

app.start()
    