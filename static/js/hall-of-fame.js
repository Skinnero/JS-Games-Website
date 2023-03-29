document.getElementsByTagName('button')[0].click()

function openScoreBoard(event, game) {
    let tabcontent, tablinks

    tabcontent = document.getElementsByClassName('tabcontent')
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"
    }
    tablinks = document.getElementsByClassName('tablinks')
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '')
    }

    document.getElementById(game).style.display = 'block'
    event.currentTarget.className += ' active'
}
