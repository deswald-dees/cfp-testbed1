document.addEventListener('alpine:init', () => {
  console.log('Alpine is ready!');
  function loadAlbum(albumPath) {
    jQuery.getJSON(albumPath, function (data) {
      let nanoGalleryItems = jQuery.map(data.images, function (image, index) {
        return {
          src: image.src,
          srct: image.thumb,
          title: image.title
        }
      });

      jQuery("#nanogallery2").nanogallery2({
        // ### gallery settings ### 
        thumbnailHeight: 200, thumbnailWidth: 200,
        galleryMaxRows: 1,
        galleryDisplayMode: 'rows',
        gallerySorting: 'random',
        thumbnailDisplayOrder: 'random',
        galleryMosaic: [
          { "c": 1, "r": 1, "w": 2, "h": 2 },
          { "c": 3, "r": 1, "w": 1, "h": 1 },
          { "c": 3, "r": 2, "w": 1, "h": 1 },
          { "c": 4, "r": 1, "w": 1, "h": 1 },
          { "c": 5, "r": 1, "w": 1, "h": 1 },
          { "c": 4, "r": 2, "w": 2, "h": 1 },
        ],
        galleryDisplayTransition: 'slideUp',
        galleryDisplayTransitionDuration: 500,
        // ### gallery content ### 
        items: nanoGalleryItems,
        locationHash: false
      });
    });
  };

  let defaultAlbum = 'people-western';
  loadAlbum('albums/' + defaultAlbum + '.json');

  Alpine.data('AlbumSelector', function () {
    return {
      currentAlbum: defaultAlbum,
      changeAlbum(event) {
        // Determine the clicked element (use the passed event or fallback to the active element)
        const _target = (event && event.target) || document.activeElement;
        const _selectedAlbum = _target && _target.getAttribute ? _target.getAttribute('data-album-selector') : null;
        if (!_selectedAlbum || _selectedAlbum ===this.currentAlbum) return;

        this.currentAlbum = _selectedAlbum;
        jQuery('#nanogallery2').nanogallery2('destroy');
        loadAlbum('albums/' + _selectedAlbum + '.json');
      }
    }
  });
});
