alert('Use WASD to move!')

function Enemy(img) {
    this.w = img.width
    this.h = img.height
    this.img = img
    var coords = edge(this)
    this.x = coords.x
    this.y = coords.y
    var target = {x: p.x, y: p.y}
    var theta = Math.atan2(-(target.y - coords.y), target.x - coords.x) + Math.PI / 2
    this.spd = 9
    this.vx = Math.sin(theta) * this.spd
    this.vy = Math.cos(theta) * this.spd
    this.rot = theta
}

var strings = {
    noReqAnimFrameMsg: 'Your browser does not support requestAnimationFrame. The game will still work without it, but please upgrade your browser (latest version of Google Chrome or Mozilla Firefox recommended) for a smoother and more enjoyable experience.'
}

var cnv, ctx, cW = cH = 600,
    reqAnimFrame = requestAnimationFrame ||
                   webkitRequestAnimationFrame ||
                   mozRequestAnimationFrame ||
                   msRequestAnimationFrame ||
                   oRequestAnimationFrame ||
                   (alert(strings.noReqAnimFrameMsg), function(x){setInterval(x,10)}),
    p = {x: 100, y: 100, xv: 0, yv: 0, spd: 2, rot: 0, rspd: 0.02, rv: 0, fric: 0.9, rfric: 0.9},
    es = [],
    keysDown = {}

window.addEventListener('load', function() {
    cnv = document.getElementById('c')
    cnv.style.border = '1px solid black'
    ctx = cnv.getContext('2d')
    cnv.width = cW
    cnv.height = cH

    p.img = new Image()
    p.img.onload = function() {
        p.w = p.img.width
        p.h = p.img.height

        tick()
    }
    p.img.src = 'player.png'
})

window.addEventListener('keydown', function(e) {
    keysDown[e.keyCode] = true
})

window.addEventListener('keyup', function(e) {
    keysDown[e.keyCode] = false
})

function tick() {
    if (Math.random() < 0.05) spawnEnemy()
    ctx.clearRect(0, 0, cW, cH)

    ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
    ctx.rotate(p.rot)
    ctx.drawImage(p.img, -p.w / 2, -p.h / 2)
    ctx.rotate(-p.rot)
    ctx.translate(-(p.x + p.w / 2), -(p.y + p.h / 2))

    if (keysDown[87]) {
        p.xv += Math.sin(p.rot) * p.spd
        p.yv -= Math.cos(p.rot) * p.spd
    }
    if (keysDown[83]) {
        p.xv -= Math.sin(p.rot) * p.spd
        p.yv += Math.cos(p.rot) * p.spd
    }
    if (keysDown[68]) p.rv += p.rspd
    if (keysDown[65]) p.rv -= p.rspd

    var bounce = false
    if (p.x < 0) p.x = 0, bounce = true
    if (p.y < 0) p.y = 0, bounce = true
    if (p.x > cW - p.w) p.x = cW - p.w, bounce = true
    if (p.y > cH - p.h) p.y = cH - p.h, bounce = true
    if (bounce) p.xv = -p.xv, p.yv = -p.yv

    p.x += p.xv
    p.y += p.yv
    p.xv *= p.fric
    p.yv *= p.fric
    p.rot += p.rv
    p.rv *= p.rfric

    for (var i = 0; i < es.length; i++) {
        var e = es[i]
        ctx.drawImage(e.img, e.x, e.y)
        e.x += e.vx
        e.y += e.vy
        if (e.x < -e.w || e.x > cW || e.y < -e.h || e.y > cH) {
            es.splice(i, 1)
            i--;
            continue;
        }
    }

    reqAnimFrame(tick)
}

function spawnEnemy() {
    es.push(new Enemy(p.img))
}

function edge(obj) {
    var e = {}
    if (Math.random() < 0.5) {
        e.x = Math.random() * cW
        e.y = Math.random() < 0.5 ? -obj.h : cH
    } else {
        e.x = Math.random() < 0.5 ? -obj.w : cW
        e.y = Math.random() * cH
    }
    return e
}
