import styled from 'styled-components';

export const DContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  .nl-line {
    border-bottom: 1px solid var(--btn-gray-300);
    margin-top: 20px;
  }
`;
export const DRow = styled.div<{ style?: React.CSSProperties }>`
  display: flex;
  flex-direction: row;
  gap: 14px;
`;
export const DCol = styled.div<{ style?: React.CSSProperties }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid var(--btn-gray-300);
  padding: 20px;
  border-radius: 6px;
`;
const EventCard = styled.div`
  position: relative;
  width: 500px;
  margin: 30px auto;
  background-color: #fff;
  background-color: var(--white);
  padding: 60px;
  border-radius: 10px;
  .nl-event-card__title {
    margin-bottom: 30px;
    text-align: center;
  }
  .nl-btn-back {
    overflow: hidden;
    background-color: transparent;
    cursor: pointer;
    position: absolute;
    left: 30px;
    top: 30px;
  }
`;
const EventContent = styled.div`
  margin-top: 30px;

  .nl-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
    color: #747272;
  }
  .nl-event-note {
    margin-bottom: 30px;
    display: flex;
    .nl-icon {
      width: 14px;
      height: 14px;
      bottom: -2px;
      position: relative;
    }
    .nl-text {
      color: #949596;
      padding-left: 6px;
    }
  }
  .nl-event__list {
    overflow-x: hidden;
    overflow-y: scroll;
    /* scroll */
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
    &::before,
    &::after {
      /* scroll */
      /* IE and Edge */
      -ms-overflow-style: none;
      /* Firefox */
      scrollbar-width: none;
    }
    &::-webkit-scrollbar {
      /* Chrome, Safari, Opera */
      display: none;
    }
    .nl-event__item:not(:last-child) {
      margin-bottom: 30px;
    }
  }
  .nl-event__date {
    color: #949596;
    margin-bottom: 10px;
    font-sze: 16px;
  }
  .nl-event__banner_frame {
    width: 100%;
    padding-bottom: 50%;
    position: relative;

    img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
  }
  .nl-mark-layer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    .nl-mark-status {
      padding: 6px 10px 6px 10px;
      line-height: 1;
      border-radius: 30px;
      color: #fff;
      &.applied {
        border: 1px solid #fff;
      }
      &.loser {
        background-color: #4a4b4d;
      }
    }
  }
`;
export { EventCard, EventContent };
