import React from 'react';
import PageButton from './PageButton.js';
import Const from '../Const';

class PaginationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchPage: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.currPage!=this.state.searchPage)
      this.setState({searchPage:nextProps.currPage})
  }

  componentDidMount() {
    document.addEventListener('click', this.documentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick);
  }

  changePage(page) {
    if (page == this.props.prePage) {
      page = this.props.currPage - 1 < 1 ? 1 : this.props.currPage - 1;
    } else if (page == this.props.nextPage) {
      page = this.props.currPage + 1 > this.totalPages ? this.totalPages : this.props.currPage + 1;
    } else if (page == this.props.lastPage) {
      page = this.totalPages;
    } else if (page == this.props.firstPage) {
      page = 1;
    } else {
      page = parseInt(page);
    }
    page = isNaN(page)?1:page;
    page = page>this.totalPages?this.totalPages:page;
    if (page != this.props.currPage) {
      this.props.changePage(page, this.props.sizePerPage);
    }
    this.setState({searchPage:page});
  }

  changeSizePerPage(e) {
    e.preventDefault();

    const selectSize = parseInt(e.currentTarget.text);
    let { currPage } = this.props;
    if (selectSize != this.props.sizePerPage) {
      this.totalPages = Math.ceil(this.props.dataSize / selectSize);
      if (currPage > this.totalPages)
        currPage = this.totalPages;

      this.props.changePage(currPage, selectSize);
      if(this.props.onSizePerPageList){
        this.props.onSizePerPageList(selectSize);
      }

      this.setState({searchPage:currPage});

      let currentDom = this.refs.pageDropDown;
      let parentDom = currentDom.parentNode;
      currentDom.setAttribute("aria-expanded",false);
      parentDom.className = "dropup";
    }
  }
  gotoPageHandle(e){
    e.preventDefault();
    let searchPage = e.currentTarget.value;
    this.setState({searchPage:searchPage});
  }
  pageDropHandle(e){
    e.preventDefault();
    let currentDom = e.currentTarget;
    let parentDom = currentDom.parentNode;
    let status = currentDom.getAttribute("aria-expanded");
    if(status== "true"){
      currentDom.setAttribute("aria-expanded",false);
      parentDom.className = "dropup";
    }else{
      currentDom.setAttribute("aria-expanded",true);
      parentDom.className = "dropup open";
    }
  }
  documentClick =(e)=>{
    var box = this.refs.pageDropDown;
    let parentDom = box && box.parentNode;
    if (parentDom && !box.contains(e.target)) {
      box.setAttribute("aria-expanded",false);
      parentDom.className = "dropup";
    }
  }
  render() {
    this.totalPages = Math.ceil(this.props.dataSize / this.props.sizePerPage);
    var pageBtns = this.makePage();
    var pageListStyle = {
      float: "right",
      marginTop: "0px"  //override the margin-top defined in .pagination class in bootstrap.
    }

    var sizePerPageList = this.props.sizePerPageList.map((sizePerPage) => {
      return (
          <li key={sizePerPage} role="presentation">
            <a role="menuitem" tabIndex="-1" href="#" onClick={this.changeSizePerPage.bind(this)}>{sizePerPage}</a>
          </li>
      );
    });

    return (
        <div style={{ marginTop: 15 }}>
          {
            this.props.sizePerPageList.length > 1
                ? <div>
              <div className="dropup" id="paginationDropDown">
                <button ref="pageDropDown" className="btn btn-default dropup-toggle" type="button" id="pageDropDown" data-toggle="dropdown" aria-expanded="false" onClick={this.pageDropHandle.bind(this)}>
                  {this.props.sizePerPage}
                      <span>
                        {" "}
                        <span className="caret"/>
                      </span>
                </button>
                <ul className="dropup-menu" role="menu" aria-labelledby="pageDropDown">
                  {sizePerPageList}
                </ul>
              </div>
              <div className="paginationDesc">
                <span className="gotoPage">转到 <input value={this.state.searchPage} onChange={this.gotoPageHandle.bind(this)}/> / {this.totalPages}   页</span>
                <a href="javascript:void(0)" className="gotoPageBtn" onClick={this.changePage.bind(this,this.state.searchPage)}>Go</a>
              </div>
              <ul className="pagination" style={pageListStyle}>
                {pageBtns}
              </ul>
            </div>
                : <div>
              <ul className="pagination" style={pageListStyle}>
                {pageBtns}
              </ul>
            </div>
          }
        </div>
    )
  }

  makePage() {
    var pages = this.getPages();
    return pages.map(function (page) {
      var isActive = page === this.props.currPage;
      var disabled = false;
      var hidden = false;
      if(this.props.currPage == 1 &&
          (page === this.props.firstPage || page === this.props.prePage)){
        disabled = true;
        hidden = true;
      }
      if(this.props.currPage == this.totalPages &&
          (page === this.props.nextPage || page === this.props.lastPage)){
        disabled = true;
        hidden = true;
      }
      return (
          <PageButton changePage={this.changePage.bind(this)} active={isActive} disable={disabled} hidden={hidden} key={page}>{page}</PageButton>
      )
    }, this);
  }

  getPages() {
    var startPage = 1, endPage = this.totalPages;

    startPage = Math.max(this.props.currPage - Math.floor(this.props.paginationSize / 2), 1);
    endPage = startPage + this.props.paginationSize - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = endPage - this.props.paginationSize + 1;
    }
    var pages;
    if(startPage != 1 && this.totalPages > this.props.paginationSize) {
      pages = [this.props.firstPage, this.props.prePage];
    } else if (this.totalPages > 1) {
      pages = [this.props.prePage];
    }
    else {
      pages = []
    }
    for (var i = startPage; i <= endPage; i++) {
      if (i > 0)pages.push(i);
    }
    if (endPage != this.totalPages) {
      pages.push(this.props.nextPage);
      pages.push(this.props.lastPage);
    } else if (this.totalPages > 1){
      pages.push(this.props.nextPage);
    }
    return pages;
  }

  getCurrentPage() {
    return this.props.currPage;
  }

  getSizePerPage() {
    return this.props.sizePerPage;
  }
}
PaginationList.propTypes = {
  currPage: React.PropTypes.number,
  sizePerPage: React.PropTypes.number,
  dataSize: React.PropTypes.number,
  changePage: React.PropTypes.func,
  sizePerPageList: React.PropTypes.array,
  paginationSize: React.PropTypes.number,
  remote: React.PropTypes.bool,
  onSizePerPageList: React.PropTypes.func,
  prePage: React.PropTypes.string
};

PaginationList.defaultProps = {
  sizePerPage: Const.SIZE_PER_PAGE
};

export default PaginationList;
