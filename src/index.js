import { getUsers } from "./api/getApi";
const FOLLOW_STATUS_KEY = 'followStatus';

function initFollowStatus() {
    const users = JSON.parse(localStorage.getItem(FOLLOW_STATUS_KEY)) || {};
    getUsers().then(data => {
        data.forEach(item => {
            if (!users[item.id]) {
                users[item.id] = { status: false };
            }
        });
        localStorage.setItem(FOLLOW_STATUS_KEY, JSON.stringify(users));
    });
  
}

function toggleFollowStatus(id) {
    const users = JSON.parse(localStorage.getItem(FOLLOW_STATUS_KEY)) || {};
    if (!users[id]) {
        users[id] = { status: false };
    }
    users[id].status = !users[id].status;
    localStorage.setItem(FOLLOW_STATUS_KEY, JSON.stringify(users));
}

function getFollowStatus(id) {
    const users = JSON.parse(localStorage.getItem(FOLLOW_STATUS_KEY)) || {};
    if (!users[id]) {
        users[id] = { status: false };
    }
    return users[id].status;
}

function increaseFollowers(id) {
    const users = JSON.parse(localStorage.getItem(FOLLOW_STATUS_KEY)) || {};
    if (!users[id]) {
        users[id] = { status: false };
    }
    users[id].followers = (users[id].followers || 0) + 1;
    localStorage.setItem(FOLLOW_STATUS_KEY, JSON.stringify(users));
}

initFollowStatus();

const users = document.querySelector('.card__list');
let perPage = 3;
let page = 1;

getUsers().then(data => {
    const dataWithIds = data.map((item, index) => {
        return {
            ...item,
            id: index + 1,
        };
    });

    const firstIndex = (page - 1) * perPage;
    const andIndex = firstIndex + perPage;
    const currentData = dataWithIds.slice(firstIndex, andIndex);

    const cardTemplate = currentData.map(item => {
        const followStatus = getFollowStatus(item.id);
        const followBtnText = followStatus ? 'Following' : 'Follow';
        return `
            <li class="card__items list">
                <div class="card__img">
                    <img class="card__img--item" src="${item.avatar}" alt="Avatar"/>
                </div>
                <p class="card__img--tweets">${item.tweets} Tweets</p>
                <p class="card__img--followers">${((item.followers || 0) + (followStatus ? 1 : 0)).toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: true })} Followers</p>
                <button class="card__img--btn__flw" type="button" data-id="${item.id}" data-status="${followStatus}">${followBtnText}</button>
            </li>
        `;
    }).join('');
  users.insertAdjacentHTML('beforeend', cardTemplate);
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            page += 1;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const newData = dataWithIds.slice(startIndex, endIndex);
        const newCards = newData.map(item => {
        const followStatus = getFollowStatus(item.id);
        const followBtnText = followStatus ? 'Following' : 'Follow';
        return `
            <li class="card__items list">
                <div class="card__img">
                    <img class="card__img--item" src="${item.avatar}" alt="Avatar" />
                </div>
                <p class="card__img--tweets">${item.tweets} Tweets</p>
                <p class="card__img--followers">${(item.followers || 0) + (followStatus ? 1 : 0)} Followers</p>
                <button class="card__img--btn__flw" type="button" data-id="${item.id}" data-status="${followStatus}">${followBtnText}</button>
            </li>
        `;
    }).join('');
    users.insertAdjacentHTML('beforeend', newCards);

    if (endIndex >= dataWithIds.length) {
        loadMoreBtn.style.display = 'none';
    }
        });
    }
});

function updateFollowButton(id, followStatus) {
  const followBtn = document.querySelector(`.card__img--btn__flw[data-id="${id}"]`);
  followBtn.dataset.status = followStatus;
  followBtn.textContent = followStatus ? 'Following' : 'Follow';
  followBtn.style.backgroundColor = followStatus ? '#5cd3a8' : '';
  followBtn.classList.toggle('following', followStatus);
  
}

users.addEventListener('click', (event) => {
    const followBtn = event.target.closest('.card__img--btn__flw');
    if (followBtn) {
        const id = parseInt(followBtn.dataset.id);
        const followStatus = followBtn.dataset.status === 'true';
        toggleFollowStatus(id);
        
        updateFollowButton(id, !followStatus);
        const followersCount = followBtn.closest('.card__items').querySelector('.card__img--followers');
        let followers = parseInt(followersCount.textContent.replace(/,/g, '').split(' ')[0]) || 0;
        followers += (followStatus ? -1 : 1);
        followersCount.textContent = followers.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:true}) + ' Followers';
    }
});