var $ = document.querySelector.bind(document) 
var $$ = document.querySelectorAll.bind(document)
var cd = $('.cd')
var playBtn = $('.btn-toggle-play')
var audio = $('#audio')
var range = $('#progress')
var isPlaying = false
var replayBtn = $('.btn-repeat')
var cdThumb = $('.cd-thumb')
var nextSongBtn = $('.btn-next')
var prevSongBtn = $('.btn-prev')
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
            console.log(currentSong)
            currentSongName.innerText = currentSong.name
            currentSongimg.style['background-image'] = `url('${currentSong.image}')`
            currentSongSinger.innerText = currentSong.singer
            audio.src = `${currentSong.path}`
        })
    },

    nextSong(){
        currentIndex++
        if(currentIndex >= this.songs.length){
            currentIndex = 0
        }
        this.loadCurrentSong()
    },

    PrevSong(){
        currentIndex--
        if(currentIndex < 0){
            currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    
    showSongs(){
        var playlist = $('.playlist')
        var htmls = this.songs.map((song) => 
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
        var changePlayBtn = $('.player')
        var _this = this
        console.log(_this)
       
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
            var btnRepeat = $('.btn-repeat i')
            if(audio.loop === false){
                audio.loop = true
                btnRepeat.style.color = 'red'
            } else{
                audio.loop = false
                btnRepeat.style.color = '#666'
            }
        }

        nextSongBtn.onclick = function(){
            _this.nextSong()
            audio.play()
        }
        prevSongBtn.onclick = function(){
            _this.PrevSong()
            audio.play()
        }
    },
    start(){
        this.showSongs()
        
        this.loadCurrentSong()        
        
        this.handleEvent()

    } 
}
app.start()


