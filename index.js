/**
 * 1. Render songs
 * 2. Sroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const play = $('.player')
const cd = $('.cd')
const heading = $('header h2');
const headingh5 = $('header h5');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prev = $('.btn-prev')
const next = $('.btn-next')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
            name: 'Em ơi đừng khóc',
            singer: 'Jack',
            path: './asset/music/EmOiDungKhocRemix.mp3',
            image: './asset/image/Jack-1.jpg',
        },
        {
            name: 'Lạc trôi',
            singer: 'Sơn Tùng',
            path: './asset/music/LacTroi.mp3',
            image: './asset/image/Sơn tùng 1.jpg',
        },
        {
            name: 'Ngôi sao cô đơn',
            singer: 'Jack',
            path: './asset/music/NgoiSaoCoDon.mp3',
            image: './asset/image/phatleee.jpg',
        },
        {
            name: 'Phận tàn',
            singer: 'Phát Lee',
            path: './asset/music/PhanTanMeeRemix.mp3',
            image: './asset/image/PMQ.jpg',
        },
        {
            name: 'Đom đóm',
            singer: 'Jack',
            path: './asset/music/NgoiSaoCoDon.mp3',
            image: './asset/image/Jack-1.jpg',
        },
        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng',
            path: './asset/music/LacTroi.mp3',
            image: './asset/image/Sơn tùng 1.jpg',
        },
        {
            name: 'Họa mây',
            singer: 'Tăng Duy Tân',
            path: './asset/music/EmOiDungKhocRemix.mp3',
            image: './asset/image/Jack-1.jpg',
        },
        {
            name: 'Kém duyên',
            singer: 'X2X',
            path: './asset/music/PhanTanMeeRemix.mp3',
            image: './asset/image/x2x.jpg',
        },
        {
            name: 'Nhạt',
            singer: 'Phan Mạnh Quỳnh',
            path: './asset/music/EmOiDungKhocRemix.mp3',
            image: './asset/image/PMQ.jpg',
        },
        {
            name: 'Hỏi thăm nhau',
            singer: 'Lê Bảo Bình',
            path: './asset/music/LacTroi.mp3',
            image: './asset/image/lebaobinh.jpg',
        },
        {
            name: 'Yêu vội vàng',
            singer: 'Lê Bảo Bình',
            path: './asset/music/EmOiDungKhocRemix.mp3',
            image: './asset/image/phatleee.jpg',
        },
        {
            name: 'Níu duyên',
            singer: 'Khánh Phương',
            path: './asset/music/PhanTanMeeRemix.mp3',
            image: './asset/image/Sơn tùng 1.jpg',
        },
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
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
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currenIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth;

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,//quay trong 10 giây
            iterations: Infinity //lặp lại vô hạn
        })
        cdThumbAnimate.pause()

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song thì play
        audio.onplay = function () {
            _this.isPlaying = true;
            play.classList.add('playing');
            cdThumbAnimate.play()//Khi ấn chạy thì ảnh quay
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            play.classList.remove('playing');
            cdThumbAnimate.pause()//Khi ấn dừng thì ảnh dừng
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lí khi tua
        progress.onchange = function (e) {
            const seekTime = audio.duration /100 * e.target.value;
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        next.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev bài hát
        prev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lí bật / tắt random 
        random.onclick = function () {
            _this. isRandom = !_this. isRandom
            random.classList.toggle('active',_this. isRandom );
        }

        // Xử lí khi repeat(Phát lại) bài hát
        repeat.onclick = function () {
            _this.isRepeat = !_this. isRepeat
            repeat.classList.toggle('active',_this. isRepeat)
        }

        // Xử lí khi hết bài next bài tiếp theo
        audio.onended = function () {
            if( _this.isRepeat){
                audio.play()
            }else{
                next.onclick();
            }
        }

        // Lắng nghe hành vi click vào playList
        playList.onclick = function(e){
            // Không click được vào bài hát đang active, nhưng vấn ấn được option
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if(songNode){
                    _this.currenIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    loadCurrentSong: function () {
        // Lấy ra tên bài hát và ảnh, ca sĩ
        heading.innerHTML = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        headingh5.innerHTML = this.currentSong.singer
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currenIndex++;
        if(this.currenIndex >= this.songs.length){
            this.currenIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currenIndex--;
        if(this.currenIndex < 0){
            this.currenIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndexSong
        do {
            newIndexSong = Math.floor(Math.random() * this.songs.length)
        } while (newIndexSong === this.currenIndex);
        this.currenIndex = newIndexSong;
        this.loadCurrentSong()
    },
    scrollToActiveSong:function(){
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 300);
    },

    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / sử lí các sự kiện (DOM events)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render Playlist
        this.render();
    }
}

app.start()