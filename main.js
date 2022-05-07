var $ = document.querySelector.bind(document) 
var $$ = document.querySelectorAll.bind(document)
var cd = $('.cd')
var playBtn = $('.btn-toggle-play')
var audio = $('#audio')
var range = $('#progress')
var isPlaying = false
var isRandom = false
var replayBtn = $('.btn-repeat')
var cdThumb = $('.cd-thumb')
var nextSongBtn = $('.btn-next')
var prevSongBtn = $('.btn-prev')
var randomBtn = $('.btn-random')
var changePlayBtn = $('.player')
var currentIndex = 0
const app = {
    songs: [
        {
            name: 'Nhạc thiếu nhi',
            singer: 'Bác sĩ hải',
            path: './assets/songs/Nonstop2020BestBuBongVol5-DJBacSiHai-6215366.mp3',
            image: 'https://i1.sndcdn.com/artworks-rLRffryJCvjMAd3v-zBO4kA-t500x500.jpg'
        },
        {
            name: "1 phút",
            singer: "Andiez",
            path: './assets/songs/1 Phut - Andiez.mp3',
            image: "https://i.ytimg.com/vi/dLQe4qEfVJw/maxresdefault.jpg"
        },
        {
            name: "Kẻ điên tin vào tình yêu",
            singer: "Lil Zpoet",
            path: "./assets/songs/Ke Dien Tin Vao Tinh Yeu - Lil Zpoet.mp3",
            image: "https://i.ytimg.com/vi/jtqD0Yepd_U/maxresdefault.jpg"
        },
        {
            name: "Lời nói điêu trên môi em",
            singer: "Đỗ Nguyên Phúc",
            path: "./assets/songs/Loi Noi Dieu Tren Moi Em - Do Nguyen Phu.mp3",
            image: "https://i1.sndcdn.com/artworks-fj4OqLv2pw2kIX3l-wH0EBg-t500x500.jpg"
        },
        {
            name: "Suýt nữa thì",
            singer: "Andiez",
            path: "./assets/songs/Suyt Nua Thi - Andiez.mp3",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        }
    ],
    
    getCurrentSong(callback){
        return callback(this.songs[currentIndex])
    },
    
    loadCurrentSong(){
        this.getCurrentSong(function(currentSong){
            var currentSongName = $('.currentSongName')
            var currentSongSinger = $('.currentSongSinger')
            var currentSongimg = $('.cd-thumb')
            currentSongName.innerText = currentSong.name
            currentSongimg.style['background-image'] = `url('${currentSong.image}')`
            currentSongSinger.innerText = currentSong.singer
            audio.src = `${currentSong.path}`
            var songs = $$('.song')
            songs.forEach(function(song, index){
                song.classList.remove('active')
                if(index === currentIndex){
                    song.classList.add('active')
                    song.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest"
                    })
                }
            })        
        })
    },    
    autoNext(){
        audio.onended = function(){
            app.nextSong()
            audio.play()
        }
    },

    randomSong(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * app.songs.length)
        }while(newIndex === currentIndex)   
        currentIndex = newIndex
        this.loadCurrentSong()
    },

    nextSong(){
        if(this.isRandom){
            this.randomSong()
        }else{
            currentIndex++
            if(currentIndex >= this.songs.length){
                currentIndex = 0
            }
            this.loadCurrentSong()
        }        
    },

    prevSong(){
        if(this.isRandom){
            this.randomSong()
        }else{
            currentIndex--
            if(currentIndex < 0){
                currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong() 
        }   
    },

    chooseSong(){
        var songs = $$('.song')
        songs[currentIndex].classList.add('active')
        songs.forEach(function(song,index){
            song.onclick = function(){
                songs.forEach(function(song){
                    song.classList.remove('active')
                })

                currentIndex = index
                app.loadCurrentSong()
                changePlayBtn.classList.add('playing')
                song.classList.add('active')
                app.isPlaying = true
                app.isRandom = false
                randomBtn.classList.remove('active')
                audio.play()
            }
        })
    },
    
    showSongs(){
        var playlist = $('.playlist')
        var htmls = this.songs.map((song, index) => 
            `
                <div class="song">
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
            `
        )
        playlist.innerHTML = htmls.join('')
    },

    handleEvent(){
        var cdWidth = cd.offsetWidth
        var _this = this
       
        var cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop
            var newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            } else{
                audio.play()
            }
            audio.onplay = function(){
                app.isPlaying = true
                changePlayBtn.classList.add('playing')
                cdThumbAnimate.play()
            }
            audio.onpause = function(){
                app.isPlaying = false
                changePlayBtn.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            audio.ontimeupdate = function(){
                range.max = this.duration
                range.value = this.currentTime
            }
            range.oninput = function(){
                audio.currentTime = this.value
            }
        }

        replayBtn.onclick = function(){
            app.isRandom = false
            randomBtn.classList.remove('active')
            
            audio.loop = !audio.loop
            replayBtn.classList.toggle('active')
        }

        nextSongBtn.onclick = function(){
            _this.nextSong()
            cdThumbAnimate.cancel()
            if(app.isPlaying){
                audio.play()
                cdThumbAnimate.play()
            } else{
                audio.pause()
            }
            audio.onplay = function(){
                app.isPlaying = true
            }
            audio.onpause = function(){
                app.isPlaying = false
            }
        }
        prevSongBtn.onclick = function(){
            _this.prevSong()
            cdThumbAnimate.cancel()
            if(app.isPlaying){
                audio.play()
                cdThumbAnimate.play()
            } else{
                audio.pause()
            }
            audio.onplay = function(){
                app.isPlaying = true
            }
            audio.onpause = function(){
                app.isPlaying = false
            }
        }
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active')
            audio.loop = false
            replayBtn.classList.remove('active')
        }
    },
    start(){
        this.showSongs()
        
        this.loadCurrentSong()        
        
        this.handleEvent()

        this.autoNext()

        this.chooseSong()
    } 
}
app.start()


