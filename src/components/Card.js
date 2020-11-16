import React, { Component } from "react";

const cardStyle = {
  width: "300px",
  height: "340px",
  border: "1px solid #eee",
  padding: "10px",
  fontSize: '14px',
  boxSizing: 'border-box'
};

export default class Card extends Component {
  render() {
    const { card, id:pid } = this.props;
    const { id, cnName, jpName, enName, cardType,race, attribute, description } = card;
    return (
      <div style={cardStyle} id={pid ? pid :`card_${id}`}>
        <h3>{cnName}</h3>
        <h3>{jpName}</h3>
        <h3>{enName}</h3>
        <p>{cardType}</p>
        <p>{race}</p>
        <p>{attribute}</p>
        <p>{cardType}</p>
        <p>{description}</p>
      </div>
    );
  }
}
