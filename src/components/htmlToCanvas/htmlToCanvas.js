import React, { Component } from "react";
import html2canvas from "html2canvas";
import Card from "../Card";
import JSZip from "jszip";

const dataJSON = [
  {
    id: "1",
    cnName: "水元素",
    jpName: "ウォーター·エレメント",
    enName: "Water Element",
    cardType: "通常怪兽",
    race: "水",
    attribute: "水",
    stars: "3",
    ATK: "900",
    DEF: "700",
    rarity: "平卡N",
    description: "住在水里的精灵。将四周用雾包围妨碍敌人的视线。",
  },
  {
    id: "2",
    cnName: "元素恶魔",
    jpName: "エレメント·デビル",
    enName: "Element Doom",
    cardType: "效果怪兽",
    race: "恶魔",
    attribute: "暗",
    stars: "4",
    ATK: "1500",
    DEF: "1200",
    rarity: "平卡N",
    description: "这只怪兽在场上有特定的属性的怪兽存在的场合，得到以下的效果。",
  },
  {
    id: "3",
    cnName: "元素恐龙",
    jpName: "エレメント·ザウルス",
    enName: "Element Saurus",
    cardType: "效果怪兽",
    race: "恐龙",
    attribute: "暗",
    stars: "4",
    ATK: "1500",
    DEF: "1200",
    rarity: "平卡N",
    description: "这只怪兽在场上有特定属性的怪兽存在的场合，得到以下的效果。",
  },
  {
    id: "4",
    cnName: "元素爆发",
    jpName: "エレメンタルバースト",
    enName: "Elemental Burst",
    cardType: "通常陷阱",
    rarity: "平卡N",
    description:
      "自己场上存在的风·水·炎·地属性的怪兽各1只作为祭品才能发动。对方场上存在的卡全部破坏。",
  },
];

const canvasWrapper = {};

const cardsWrapper = {
  fontSize: "14px",
};

export default class HtmlToCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchData: [],
      batchBase64Data: [],
    };
  }

  singleHtml2canvas = () => {
    let base64Arr = [];
    const { batchData } = this.state;
    const _id = `card_${batchData[0].id}`;
    html2canvas(document.getElementById(`${_id}`), {
      backgroundColor: "transparent",
    }).then((canvas) => {
      // 重点之一，获取 canvas 的 base64
      const base64Data = canvas
        .toDataURL("image/jpeg")
        // 重点之二，必须把base64的头给去掉才能转成图片，不然后面使用jszip插件的时候，插件会检测到该数据是一个文件路径而导致报错
        .replace("data:image/jpeg;base64,", "");
      // 把数据的指定元素保存为到时候生成图片文件的文件名
      const _name = batchData[0].cnName;
      base64Arr.push({ name: _name, base64: base64Data });
      this.data2JSzip(base64Arr);
    });
  };

  data2JSzip(base64Arr) {
    //   初始化事件
    var zip = new JSZip();
    // 遍历数据
    base64Arr.map(function (obj) {
      // 往zip包里面不断塞jpg文件，使用上面保存的 name 作为文件名
      // 后面的 { base64: true } 记得设置，意思为允许 base64 的数据
      zip.file(`${obj.name}.jpg`, obj.base64, { base64: true });
      return this;
    });
    zip
      .generateAsync({
        type: "blob",
      })
      .then(function (content) {
        // 下载的文件名
        var filename = `${base64Arr.length > 1 ? "批量下载" : "单个下载"}.zip`;
        // 创建隐藏的可下载链接
        var eleLink = document.createElement("a");
        eleLink.download = filename;
        // eleLink.style.display = "none";
        // 下载内容转变成blob地址
        eleLink.href = URL.createObjectURL(content);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      });
  }

  batchHtml2canvas = () => {
    let base64Arr = [];
    dataJSON.map((card) => {
      html2canvas(document.getElementById(`card_${card.id}`), {
        backgroundColor: "transparent",
      }).then((canvas) => {
        const base64Data = canvas
          .toDataURL("image/jpeg")
          //   必须把base64的头给去掉才能转成图片，不然会检测到是一个文件路径导致报错
          .replace("data:image/jpeg;base64,", "");
        const _name = card.cnName;
        base64Arr.push({ name: _name, base64: base64Data });
        if (base64Arr.length === dataJSON.length) {
          this.data2JSzip(base64Arr);
        }
      });
      return "";
    });
  };

  //   更新批量数据
  getBatchData = () => {
    this.setState({
      batchData: dataJSON,
    });
  };

  //   更新单个数据
  getSingleData = () => {
    this.setState({
      batchData: [dataJSON[0]],
    });
  };
  //   更新数据，父组件执行渲染
  componentDidUpdate() {
    console.log("====================================");
    if (this.state.batchData.length === 1) {
      this.singleHtml2canvas && this.singleHtml2canvas();
    } else {
      this.batchHtml2canvas && this.batchHtml2canvas();
    }
    console.log("====================================");
  }

  render() {
    const CardsItem =
      this.state.batchData.length > 0 ? (
        this.state.batchData.length > 1 ? (
          this.state.batchData.map((card, index) => (
            <Card card={card} key={card.id} />
          ))
        ) : (
          <Card card={dataJSON[0]} key={dataJSON[0].id} />
        )
      ) : (
        <div></div>
      );
    return (
      <div id="canvasMain">
        <h3>html2canvas</h3>
        <button onClick={this.getSingleData}>单个转canvas</button>
        <button onClick={this.getBatchData}>批量转canvas</button>

        <div id={canvasWrapper}></div>

        <table style={cardsWrapper}>
          <thead>
            {dataJSON.map((card) => (
              <tr key={card.id}>
                <td>{card.cnName}</td>
                <td>{card.jpName}</td>
                <td>{card.enName}</td>
                <td>{card.race}</td>
                <td>{card.cardType}</td>
                <td>{card.description}</td>
              </tr>
            ))}
          </thead>
        </table>

        <div style={cardsWrapper}>{CardsItem}</div>
      </div>
    );
  }
}
