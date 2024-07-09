import {consoleLog} from '../commonHelper/utils';

export function TransformNojoomPartnerRewards(data) {
  try {
    let _categories = [];
    let _partnerslist = [];
    for (let i = 0; i < data.length; i++) {
      let _catgitem = _categories.filter(x => x.catgname == data[i].category);
      if (
        _catgitem == null ||
        _catgitem == undefined ||
        _catgitem.length == 0
      ) {
        let itm = {
          id: i,
          catgname: data[i].category,
          name: data[i].category,
          image: data[i].image,
          categoryimage: data[i].categoryimage,
          partnertype: data[i].partnertype,
          categorydesc: data[i].categorydesc,
          data: [],
        };
        itm.data.push(JSON.parse(JSON.stringify(data[i])));
        _categories.push(itm);
      } else {
        if (_catgitem != null && _catgitem.length > 0) {
          _catgitem[0].data.push(JSON.parse(JSON.stringify(data[i])));
        }
      }
    }
    return _categories;
  } catch (e) {}
  return [];
}

export function TransformNojoomOoredooRewards(response) {
  try {
    let resp = [];
    if (response?.category?.length > 0 && response?.data?.length > 0) {
      response?.data?.filter(o1 =>
        response?.category?.filter(o2 => {
          if (o1.id === o2.id) {
            
            resp.push({...o1, ...o2});
          }
        })
      );
      return resp;
    }
  } catch (e) {}
  return [];
}

export function slicePointsHistoryTo10(data) {
  let historyListData = data?.response?.History;
  if (data?.response?.History && data?.response?.History?.length > 10) {
    historyListData = data?.response?.History.slice(0, 10);
  }
  return historyListData;
}
