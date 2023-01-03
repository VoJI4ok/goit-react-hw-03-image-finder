import React, { Component } from 'react';
import Notiflix from 'notiflix';
import fetchPictures from './Api';
import SearchBar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import ImageGalleryItem from 'components/ImageGalleryItem';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';

Notiflix.Notify.init({
  position: 'left-top',
  cssAnimationStyle: 'zoom',
  fontSize: '20px',
});

export class App extends Component {
  state = {
    pictures: [],
    isLoading: false,
    showModal: false,
    loadMore: false,
    error: null,
    searchQuery: '',
    pageNumber: 1,
    modalURL: '',
  };

  // async componentDidMount() {
  //   this.setState({ isLoading: true });
  //   try {
  //     const pictures = await fetchPictures(
  //       this.state.searchQuery,
  //       this.state.pageNumber
  //     );
  //     this.setState({ pictures });
  //   } catch (error) {
  //     this.setState({ error });
  //     console.log(error);
  //   } finally {
  //     this.setState({ isLoading: false });
  //     // console.log('dfegdh');
  //   }
  // }

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.state.searchQuery !== prevState.searchQuery ||
      this.state.pageNumber !== prevState.pageNumber
    ) {
      this.setState({ isLoading: true });
      try {
        const pictures = await fetchPictures(
          this.state.searchQuery,
          this.state.pageNumber
        );
        this.setState({ loadMore: true });
        if (pictures.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          this.setState({ loadMore: false });
        }

        if (pictures.length < 12) {
          this.setState({ loadMore: false });
        }

        this.setState({
          pictures: [...this.state.pictures, ...pictures],
        });
      } catch (error) {
        this.setState({ error });
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  formSubmitHandler = query => {
    this.setState({ searchQuery: query, pageNumber: 1, pictures: [] });
    // localStorage.setItem('pictures', JSON.stringify(this.state.pictures));
  };

  imageClickHandler = url => {
    this.setState({ modalURL: url });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  loadMoreHandler = pageNumber => {
    this.setState({ pageNumber });
  };

  render() {
    const { isLoading, pictures, showModal, modalURL, loadMore } = this.state;
    return (
      <div>
        <SearchBar onSubmit={this.formSubmitHandler} />
        <div className="gallery-wrap">
          <ImageGallery>
            {pictures.map(picture => (
              <ImageGalleryItem
                key={picture.id}
                picture={picture}
                onClick={this.imageClickHandler}
              ></ImageGalleryItem>
            ))}
          </ImageGallery>
          {loadMore && (
            <Button
              onClick={this.loadMoreHandler}
              page={this.state.pageNumber}
            ></Button>
          )}
        </div>
        {isLoading && <Loader />}
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={modalURL} alt={pictures.tags} />
          </Modal>
        )}
      </div>
    );
  }
}
