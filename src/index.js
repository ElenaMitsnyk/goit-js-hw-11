'use string';
import { fetchImage } from './js/fetchImage';
import { pageScrolling } from './js/pageScrolling';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  inputFormEl: document.querySelector('input'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('button.load-more'),
};

let page = 1;
const perPage = 40;

refs.searchFormEl.addEventListener('submit', onSubmit);
refs.btnLoadMoreEl.addEventListener('click', onLoadMoreBtn);
refs.btnLoadMoreEl.style.display = 'none';

async function onSubmit(event) {
  event.preventDefault();
  resetMarkup();

  const inputValue = refs.inputFormEl.value.trim();

  if (inputValue === '') {
    return info();
  }

  const fetchPromise = await fetchImage(inputValue, perPage, page);

  try {
    if (fetchPromise.data.total === 0) {
      failure();
      return;
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${fetchPromise.data.totalHits} images.`
      );

      createsMarkupGalleryItems(fetchPromise.data.hits);
      pageScrolling();
      refs.btnLoadMoreEl.style.cssText =
        'display: block; margin: 0 auto; background-color: rgb(238, 238, 6)';
    }

    if (page * perPage >= fetchPromise.data.totalHits) {
      warning();
      refs.btnLoadMoreEl.style.display = 'none';
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong...');
  }
}

async function onLoadMoreBtn(event) {
  event.preventDefault();
  page += 1;
  const inputValue = refs.inputFormEl.value.trim();

  const fetchPromise = await fetchImage(inputValue, perPage, page);

  try {
    if (page * perPage >= fetchPromise.data.totalHits) {
      warning();
      refs.btnLoadMoreEl.style.display = 'none';
    }
    createsMarkupGalleryItems(fetchPromise.data.hits);
    pageScrolling();
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong...');
  }
}

function createsMarkupGalleryItems(data) {
  const galleryItems = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="photo-card__link" href="${largeImageURL}">
            <div class="photo-card">
               <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
        </div>
        </a>`
    )
    .join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', galleryItems);
  simpleLightbox.refresh();
}

function resetMarkup() {
  refs.galleryEl.innerHTML = '';
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function info() {
  Notiflix.Notify.info('Enter your data to search.');
}

function warning() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
}