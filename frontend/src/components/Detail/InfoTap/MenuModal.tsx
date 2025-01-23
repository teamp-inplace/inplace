import { useEffect, useState } from 'react';
import { BsCardImage } from 'react-icons/bs';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';

import styled from 'styled-components';

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Image } from '@chakra-ui/react';

export default function MenuModal({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <ImageWrapper>
        <BsCardImage size={26} color="white" onClick={() => openModal(0)} />
        {images.slice(0, isMobile ? 1 : 2).map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Menu Image ${index + 1}`}
            onClick={() => openModal(index)}
            style={{ width: '100%' }}
            cursor="pointer"
          />
        ))}
      </ImageWrapper>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={closeModal} isCentered size="xl">
        <ModalOverlay onClick={closeModal} />
        <StyledModalContent position="fixed" left="50%" transform="translateX(-50%) !important">
          <ModalHeader padding="20px 0px" fontSize={{ base: '20px', md: '16px' }}>
            Menu {currentImageIndex + 1}/{images.length}
          </ModalHeader>
          <ModalCloseButton
            position="absolute"
            right={20}
            top={20}
            background="none"
            border="none"
            fontSize={{ base: '20px', md: '16px' }}
            color="grey"
            cursor="pointer"
          />
          <StyledModalBody display="flex" justifyContent="center" width={{ base: '90%', md: '100%' }} height="auto">
            <Button onClick={prevImage}>
              <GrFormPrevious size={30} color="grey" />
            </Button>
            <Image
              src={images[currentImageIndex]}
              alt={`Menu Image ${currentImageIndex + 1}`}
              width="80%"
              height="auto"
              aspectRatio="1.2 / 1"
              objectFit="cover"
            />
            <Button onClick={nextImage}>
              <GrFormNext size={30} color="grey" />
            </Button>
          </StyledModalBody>
          <ThumbnailWrapper>
            <ThumbnailContainer>
              {images.map((src, index) => (
                <Thumbnail
                  key={src}
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  $isActive={currentImageIndex === index}
                />
              ))}
            </ThumbnailContainer>
          </ThumbnailWrapper>
        </StyledModalContent>
      </Modal>
    </>
  );
}
const ImageWrapper = styled.div`
  width: 940px;
  display: flex;
  gap: 10px;
  height: 260px;
  position: relative;
  svg {
    position: absolute;
    right: 16px;
    bottom: 14px;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 200px;
    svg {
      width: 20px;
    }
  }
`;
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const StyledModalContent = styled(ModalContent)`
  max-width: 800px;
  height: 700px;
  top: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  z-index: 100;

  @media screen and (max-width: 768px) {
    max-width: 80%;
    aspect-ratio: 1 / 1;
    height: auto;
    top: 10vh;
  }
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
const ThumbnailWrapper = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px 0;
  margin-top: 10px;
  background-color: #f8f8f8;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ThumbnailContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

const Thumbnail = styled.img<{ $isActive: boolean }>`
  width: 80px;
  aspect-ratio: 2/1.8;
  cursor: pointer;
  border: ${({ $isActive }) => ($isActive ? '2px solid #55ebff' : '2px solid transparent')};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)};
  transition:
    border 0.3s ease,
    opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  @media screen and (max-width: 768px) {
    width: 80px;
    aspect-ratio: 1;
    height: auto;
  }
`;
