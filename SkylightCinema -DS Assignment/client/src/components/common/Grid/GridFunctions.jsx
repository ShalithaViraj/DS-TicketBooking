import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import _ from "underscore";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <div className="row">
      <div className="col-md-12">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            autoComplete="off"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
            name="search"
          />

          <button
            className="btn text-white btn-primary"
            type="button"
            onClick={onClear}
          >
            {filterText.length > 0 ? (
              <i className="fas fa-times grid-search-icon"></i>
            ) : (
              <i className="fas fa-search grid-search-icon"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  </>
);

const GridFunctions = (props) => {
  const [filterText, setFilterText] = useState("");

  const searchQuery = () => {
    let query = "( ";
    const arrFeild = props.columns.filter((col) => col.selector);
    arrFeild.map((ele) => {
      query +=
        "item." +
        ele.selector +
        "?.toString().toLowerCase().includes(filterText.toString().toLowerCase())";
      if (arrFeild[arrFeild.length - 1].selector != ele.selector)
        query += " || ";
    });
    query += " )";
    return query;
  };

  const filteredItems = _.filter(props.dataSet, function (item) {
    return eval(searchQuery());
  });

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value.toUpperCase())}
        onClear={handleClear}
        filterText={filterText}
        columns={props.columns}
      />
    );
  }, [filterText]);

  return (
    <div>
      <DataTable
        title={props.title}
        columns={props.columns}
        theme="solarized"
        data={filteredItems}
        highlightOnHover
        onRowClicked={(res) => props.fnRowClick ? props.fnRowClick(res) : null}
        data-tag="allowRowEvents"
        persistTableHead
        subHeader
        subHeaderWrap
        pagination
        subHeaderComponent={subHeaderComponentMemo}
        fixedHeader={true}
        fixedHeaderScrollHeight={props.strHeight || "400px"}
      />
    </div>
  )
};

export default GridFunctions;
