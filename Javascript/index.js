const canvas = document.querySelector(`canvas`);
const c = canvas.getContext(`2d`);
//*I put them on css but i dont know how to lol
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0,canvas.width, canvas.height )

const gravity = 2.5 //pull downn 


//*background image
const background = new Sprite ({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './Media/background.png',
  scale: 1,
  framesMax: 1
})

//*shop image
const shop = new Sprite ({
  position: {
    x: 600,
    y: 127
  },
  imageSrc: './Media/shop.png',
  scale: 2.75,
  framesMax: 6
})

//* player 
const player = new Fighter({
  position:{
  x: 100,
  y: 0
  },
  velocity:{
    x: 0,
    y: 0
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './Media/Sprites/samuraiMack/Idle.png',
  scale: 2.5,
  framesMax: 8,
  offset: {
    x:215,
    y:155
  },
  sprites: {
    idle: {
      imageSrc: './Media/Sprites/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './Media/Sprites/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './Media/Sprites/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './Media/Sprites/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './Media/Sprites/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './Media/Sprites/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './Media/Sprites/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 30
    },
    width: 150,
    height: 100
  }
})

//* enemy
const enemy = new Fighter({
  position:{
    x: 800,
    y:0
  },
  velocity: {
    x:0,
    y:0
  },
  imageSrc: './Media/Sprites/kenji/Idle.png',
  scale: 2.5,
  framesMax: 4,
  offset: {
    x:215,
    y:169
  },
  sprites: {
    idle: {
      imageSrc: './Media/Sprites/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './Media/Sprites/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './Media/Sprites/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './Media/Sprites/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './Media/Sprites/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit:{
      imageSrc: './Media/Sprites/kenji/Take Hit.png',
      framesMax: 3
    },
    death:{
      imageSrc: './Media/Sprites/kenji/Death.png',
      framesMax: 7
    }
    
  },
  attackBox: {
    offset: {
      x: -170,
      y: 30
    },
    width: 140,
    height: 100
  }
}) 

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
} 

function rectangularCollision ({
  rectangle1,
  rectangle2
}) {
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
      rectangle2.position.x && 
    rectangle1.attackBox.position.x <= 
      rectangle2.position.x + rectangle2.width && 
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
      rectangle2.position.y && 
    rectangle1.attackBox.position.y <= 
      rectangle2.position.y + rectangle2.height
  )
}

decreaseTimer()

//* UPDATE
function animate() {
  window.requestAnimationFrame(animate) //its a loop 
  // c.fillStyle = 'black'
  // c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
  
  player.velocity.x = 0
  enemy.velocity.x = 0
  
  
  //* player move
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x =-5  
    player.switchSprite('idle')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x =7  
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  
  //* player jump
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }
  
  
  //enemy move 

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x =-7
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x =5
    enemy.switchSprite('idle')
  } else {
    enemy.switchSprite('idle')
  }
  //* player jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }
  
  //collision player
  if ( 
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) && 
    player.isAttacking && player.framesCurrent === 4
    ) {
    enemy.takeHit()
    player.isAttacking = false 
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  } 
  if (player.isAttacking && player.framesCurrent ===4) {
    player.isAttacking = false
  }
  
  //colliison enemy
  if ( 
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) && 
    enemy.isAttacking && enemy.framesCurrent === 2
    ) {
    player.takeHit()
    enemy.isAttacking = false
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }
  if (enemy.isAttacking && player.framesCurrent ===2) {
    enemy.isAttacking = false
  }
  
  //win by taking health
   if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player, enemy, timerId})
   }
}

animate()

window.addEventListener('keydown',(event) => { 
  //player
  if (!player.dead){
  switch(event.key) {
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
    break
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
    break
    case 'w':
      player.velocity.y = -30
  break
    case ' ':
      player.attack()
      break
  }
}

  //enemy 
  if (!enemy.dead){
   switch(event.key){
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
    break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
    break
    case 'ArrowUp':
      enemy.velocity.y = -30
  break
    case 'ArrowDown':
      enemy.attack()
      break
   }
  }

})

window.addEventListener('keyup',(event) => {
  //player
  switch(event.key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
    break
    case 'd':
      keys.d.pressed = false
    break 
  }
  //enemy
  switch(event.key) {
    case 'a':
      keys.a.pressed = false
    break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
    break 
  }
})