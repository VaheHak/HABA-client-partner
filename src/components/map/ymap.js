import React, { Component } from 'react';
import { GeoObject, Map, Placemark, YMaps } from "react-yandex-maps";
import _ from "lodash";

class YMap extends Component {

  onYmapsLoad = (ymaps) => {
    const {onSuggestSelect, input} = this.props;
    this.ymaps = ymaps;
    if (this.ymaps && input){
      new this.ymaps.SuggestView(input.current).events.add("select", onSuggestSelect);
    }
  };

  render() {
    const {onClick, coords, state, zoom, coordinates, from, to} = this.props;
    const pattern = /^-?[\d]{1,3}[.][\d]+$/;

    return (
      <YMaps query={ {
        ns: 'use-load-option',
        load: 'package.full',
        lang: 'en_RU',
      } }>
        <Map state={ {
          center: !_.isEmpty(state) && pattern.test(state[0]) && pattern.test(state[1]) ? state : [40.785269, 43.841680],
          zoom: zoom ? zoom : 7
        } }
             width={ '100%' }
             height={ 300 }
             onLoad={ this.onYmapsLoad }
             instanceRef={ map => (this.map = map) }
             onClick={ onClick }
        >
          { !_.isEmpty(coords) && pattern.test(state[0]) && pattern.test(state[1]) ? <Placemark
            geometry={ coords }
            properties={ {
              balloonContent: coords,
              hintContent: coords,
            } }
          /> : null }
          { !_.isEmpty(from) && pattern.test(from[0]) && pattern.test(from[1]) ? <Placemark
            geometry={ from }
            properties={ {
              balloonContent: from,
              hintContent: from,
              iconContent: 'From'
            } }
            options={ {
              preset: 'islands#darkGreenStretchyIcon'
            } }
          /> : null }
          { !_.isEmpty(to) && pattern.test(to[0]) && pattern.test(to[1]) ? <Placemark
            geometry={ to }
            properties={ {
              balloonContent: to,
              hintContent: to,
              iconContent: 'To'
            } }
            options={ {
              preset: 'islands#redStretchyIcon'
            } }
          /> : null }
          { !_.isEmpty(coordinates) && !_.isEmpty(coordinates[0]) && !_.isEmpty(coordinates[1]) ? <GeoObject
            geometry={ {
              type: 'LineString',
              coordinates: coordinates,
            } }
            options={ {
              geodesic: true,
              strokeWidth: 5,
            } }
          /> : null }
        </Map>
      </YMaps>
    );
  }
}

export default YMap;
