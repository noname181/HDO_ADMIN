/**
 * AUIGridReact.js for React.js v1.2.20230823
 * Based on AUIGrid v3.0.12.9
 * Copyright © AUISoft Co., Ltd.
 * www.auisoft.net
 */
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

// 프로젝트 경로에 맞게 바꾸세요
import '../AUIGrid/AUIGrid';
import '../AUIGrid/AUIGridLicense';
import '../AUIGrid/AUIGrid_style.css';

// 이 아래 소스는 절대 수정하지 마세요.
const $ag = typeof window === 'undefined' ? {} : window.AUIGrid;
let uuid = 0;
class AUIGrid extends React.Component {
	constructor(props) {
		super(props);
		this.uuid = uuid.toString();
		uuid += 1;
		this.id = 'aui-grid-wrap-' + (this.props.name !== '' ? this.props.name : this.uuid);
		this.pid = '#' + this.id;
		this.timerId = null;
	}

	componentDidMount() {
		$ag.create(this.pid, this.props.columnLayout, this.props.gridProps);
		$ag.setFooter(this.pid, this.props.footerLayout);
		this.__setupGlobalReisze();
	}

	componentWillUnmount() {
		this.__resetGlobalReisze();
		if ($ag.isCreated(this.pid)) $ag.destroy(this.pid);
	}

	__setupGlobalReisze() {
		if (!this.props.autoResize) return;
		window.addEventListener('resize', this.__globalResizeHandler.bind(this));
	}

	__resetGlobalReisze() {
		if (!this.props.autoResize) return;
		window.removeEventListener('resize', this.__globalResizeHandler.bind(this));
	}

	__globalResizeHandler(event) {
		const that = this;
		if (that.timerId !== null) {
			clearTimeout(that.timerId);
		}
		that.timerId = setTimeout(function () {
			if ($ag.isCreated(that.pid)) {
				$ag.resize(that.pid);
			}
		}, that.resizeDelayTime);
	}

	render() {
		return <div id={this.id}></div>;
	}
	create(columnLayout, props) {
		$ag.create(this.pid, columnLayout, props);
		this.__setupGlobalReisze();
		return this.pid;
	}

	addCheckedRowsByIds(rowIds) {
		$ag.addCheckedRowsByIds.call($ag, this.pid, arguments[0]);
	}
	addCheckedRowsByValue(dataField, value) {
		$ag.addCheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	addColumn(cItems, position) {
		$ag.addColumn.call($ag, this.pid, arguments[0], arguments[1]);
	}
	addRow(items, rowIndex) {
		$ag.addRow.call($ag, this.pid, arguments[0], arguments[1]);
	}
	addTreeColumn(cItems, parentDataField, position) {
		$ag.addTreeColumn.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	addTreeRow(item, parentRowId, position) {
		$ag.addTreeRow.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	addTreeRowByIndex(items, rowIndex) {
		$ag.addTreeRowByIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	addUncheckedRowsByIds(rowIds) {
		$ag.addUncheckedRowsByIds.call($ag, this.pid, arguments[0]);
	}
	addUncheckedRowsByValue(dataField, value) {
		$ag.addUncheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	appendData(items) {
		$ag.appendData.call($ag, this.pid, arguments[0]);
	}
	bind(name, func) {
		$ag.bind.call($ag, this.pid, arguments[0], arguments[1]);
	}
	changeColumnLayout(newLayout) {
		$ag.changeColumnLayout.call($ag, this.pid, arguments[0]);
	}
	changeFooterLayout(newLayout) {
		$ag.changeFooterLayout.call($ag, this.pid, arguments[0]);
	}
	clearFilter(dataField) {
		$ag.clearFilter.call($ag, this.pid, arguments[0]);
	}
	clearFilterAll() {
		$ag.clearFilterAll.call($ag, this.pid);
	}
	clearGridData() {
		$ag.clearGridData.call($ag, this.pid);
	}
	clearSelection() {
		$ag.clearSelection.call($ag, this.pid);
	}
	clearSortingAll() {
		$ag.clearSortingAll.call($ag, this.pid);
	}
	clearUndoRedoStack() {
		$ag.clearUndoRedoStack.call($ag, this.pid);
	}
	closeFilterLayer() {
		$ag.closeFilterLayer.call($ag, this.pid);
	}
	collapseAll() {
		$ag.collapseAll.call($ag, this.pid);
	}
	destroy() {
		$ag.destroy.call($ag, this.pid);
	}
	expandAll() {
		$ag.expandAll.call($ag, this.pid);
	}
	expandItemByRowId(rowId, open, recursive) {
		$ag.expandItemByRowId.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	exportAsCsv(props) {
		$ag.exportAsCsv.call($ag, this.pid, arguments[0]);
	}
	exportAsJson(keyValueMode, props) {
		$ag.exportAsJson.call($ag, this.pid, arguments[0], arguments[1]);
	}
	exportAsObject(keyValueMode) {
		return $ag.exportAsObject.call($ag, this.pid, arguments[0]);
	}
	exportAsPdf(props) {
		$ag.exportAsPdf.call($ag, this.pid, arguments[0]);
	}
	exportAsTxt(props) {
		$ag.exportAsTxt.call($ag, this.pid, arguments[0]);
	}
	exportAsXlsx(exportWithStyle, props) {
		$ag.exportAsXlsx.call($ag, this.pid, arguments[0], arguments[1]);
	}
	exportAsXml(props) {
		$ag.exportAsXml.call($ag, this.pid, arguments[0]);
	}
	exportToCsv(props) {
		$ag.exportToCsv.call($ag, this.pid, arguments[0]);
	}
	exportToJson(keyValueMode, props) {
		$ag.exportToJson.call($ag, this.pid, arguments[0], arguments[1]);
	}
	exportToObject(keyValueMode) {
		return $ag.exportToObject.call($ag, this.pid, arguments[0]);
	}
	exportToPdf(props) {
		$ag.exportToPdf.call($ag, this.pid, arguments[0]);
	}
	exportToTxt(props) {
		$ag.exportToTxt.call($ag, this.pid, arguments[0]);
	}
	exportToXlsx(exportWithStyle, props) {
		$ag.exportToXlsx.call($ag, this.pid, arguments[0], arguments[1]);
	}
	exportToXlsxMulti(subGridIds, props) {
		$ag.exportToXlsxMulti.call($ag, this.pid, arguments[0], arguments[1]);
	}
	exportToXml(props) {
		$ag.exportToXml.call($ag, this.pid, arguments[0]);
	}
	forceEditingComplete(value, cancel) {
		$ag.forceEditingComplete.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getAddedColumnFields() {
		return $ag.getAddedColumnFields.call($ag, this.pid);
	}
	getAddedRowItems() {
		return $ag.getAddedRowItems.call($ag, this.pid);
	}
	getAscendantsByRowId(rowId) {
		return $ag.getAscendantsByRowId.call($ag, this.pid, arguments[0]);
	}
	getCellElementByIndex(rowIndex, columnIndex) {
		return $ag.getCellElementByIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getCellFormatValue(rowIndex, dataField) {
		return $ag.getCellFormatValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getCellValue(rowIndex, dataField) {
		return $ag.getCellValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getCheckedRowItems() {
		return $ag.getCheckedRowItems.call($ag, this.pid);
	}
	getCheckedRowItemsAll() {
		return $ag.getCheckedRowItemsAll.call($ag, this.pid);
	}
	getColumnCount() {
		return $ag.getColumnCount.call($ag, this.pid);
	}
	getColumnDistinctValues(dataField, total) {
		return $ag.getColumnDistinctValues.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getColumnIndexByDataField(dataField) {
		return $ag.getColumnIndexByDataField.call($ag, this.pid, arguments[0]);
	}
	getColumnInfoList() {
		return $ag.getColumnInfoList.call($ag, this.pid);
	}
	getColumnItemByDataField(dataField) {
		return $ag.getColumnItemByDataField.call($ag, this.pid, arguments[0]);
	}
	getColumnItemByIndex(columnIndex) {
		return $ag.getColumnItemByIndex.call($ag, this.pid, arguments[0]);
	}
	getColumnLayout() {
		return $ag.getColumnLayout.call($ag, this.pid);
	}
	getColumnValues(dataField, total) {
		return $ag.getColumnValues.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getCurrentPageData() {
		return $ag.getCurrentPageData.call($ag, this.pid);
	}
	getDataFieldByColumnIndex(columnIndex) {
		return $ag.getDataFieldByColumnIndex.call($ag, this.pid, arguments[0]);
	}
	getDepthByRowId(rowId) {
		return $ag.getDepthByRowId.call($ag, this.pid, arguments[0]);
	}
	getDescendantsByRowId(rowId) {
		return $ag.getDescendantsByRowId.call($ag, this.pid, arguments[0]);
	}
	getEditedRowColumnItems() {
		return $ag.getEditedRowColumnItems.call($ag, this.pid);
	}
	getEditedRowItems() {
		return $ag.getEditedRowItems.call($ag, this.pid);
	}
	getFilterCache() {
		return $ag.getFilterCache.call($ag, this.pid);
	}
	getFilterInlineTexts() {
		return $ag.getFilterInlineTexts.call($ag, this.pid);
	}
	getFitColumnSizeList(fitToGrid) {
		return $ag.getFitColumnSizeList.call($ag, this.pid, arguments[0]);
	}
	getFooterData() {
		return $ag.getFooterData.call($ag, this.pid);
	}
	getFooterFormatValueByDataField(posField) {
		return $ag.getFooterFormatValueByDataField.call($ag, this.pid, arguments[0]);
	}
	getFooterLayout() {
		return $ag.getFooterLayout.call($ag, this.pid);
	}
	getFooterValueByDataField(posField) {
		return $ag.getFooterValueByDataField.call($ag, this.pid, arguments[0]);
	}
	getGridData() {
		return $ag.getGridData.call($ag, this.pid);
	}
	getGridDataWithState(stateField, option) {
		return $ag.getGridDataWithState.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getHiddenColumnDataFields() {
		return $ag.getHiddenColumnDataFields.call($ag, this.pid);
	}
	getHiddenColumnIndexes() {
		return $ag.getHiddenColumnIndexes.call($ag, this.pid);
	}
	getIndexesByEvent(mouseEvent) {
		return $ag.getIndexesByEvent.call($ag, this.pid, arguments[0]);
	}
	getInitCellValue(rowId, dataField) {
		return $ag.getInitCellValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getInitValueItem(rowId) {
		return $ag.getInitValueItem.call($ag, this.pid, arguments[0]);
	}
	getItemByRowId(rowId) {
		return $ag.getItemByRowId.call($ag, this.pid, arguments[0]);
	}
	getItemByRowIndex(rowIndex) {
		return $ag.getItemByRowIndex.call($ag, this.pid, arguments[0]);
	}
	getItemsByValue(dataField, value) {
		return $ag.getItemsByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getMergeEndRowIndex(rowIndex, columnIndex) {
		return $ag.getMergeEndRowIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getMergeItems(rowIndex, columnIndex) {
		return $ag.getMergeItems.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getMergeStartRowIndex(rowIndex, columnIndex) {
		return $ag.getMergeStartRowIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getOrgGridData() {
		return $ag.getOrgGridData.call($ag, this.pid);
	}
	getParentColumnByDataField(dataField) {
		return $ag.getParentColumnByDataField.call($ag, this.pid, arguments[0]);
	}
	getParentItemByRowId(rowId) {
		return $ag.getParentItemByRowId.call($ag, this.pid, arguments[0]);
	}
	getProp(name) {
		return $ag.getProp.call($ag, this.pid, arguments[0]);
	}
	getProperty(name) {
		return $ag.getProperty.call($ag, this.pid, arguments[0]);
	}
	getRemovedColumnFields() {
		return $ag.getRemovedColumnFields.call($ag, this.pid);
	}
	getRemovedItems(includeAdded) {
		return $ag.getRemovedItems.call($ag, this.pid, arguments[0]);
	}
	getRemovedNewItems() {
		return $ag.getRemovedNewItems.call($ag, this.pid);
	}
	getRowCount() {
		return $ag.getRowCount.call($ag, this.pid);
	}
	getRowIndexesByValue(dataField, values) {
		return $ag.getRowIndexesByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getRowPosition() {
		return $ag.getRowPosition.call($ag, this.pid);
	}
	getRowsByValue(dataField, values) {
		return $ag.getRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	getScaleFactor() {
		return $ag.getScaleFactor.call($ag, this.pid);
	}
	getSelectedColIndexes() {
		return $ag.getSelectedColIndexes.call($ag, this.pid);
	}
	getSelectedIndex() {
		return $ag.getSelectedIndex.call($ag, this.pid);
	}
	getSelectedItems() {
		return $ag.getSelectedItems.call($ag, this.pid);
	}
	getSelectedRows() {
		return $ag.getSelectedRows.call($ag, this.pid);
	}
	getSelectedText(exceptHidden) {
		return $ag.getSelectedText.call($ag, this.pid, arguments[0]);
	}
	getSortingFields() {
		return $ag.getSortingFields.call($ag, this.pid);
	}
	getStateCache() {
		return $ag.getStateCache.call($ag, this.pid);
	}
	getTreeFilteredFlatData() {
		return $ag.getTreeFilteredFlatData.call($ag, this.pid);
	}
	getTreeFlatData() {
		return $ag.getTreeFlatData.call($ag, this.pid);
	}
	getTreeGridData() {
		return $ag.getTreeGridData.call($ag, this.pid);
	}
	getTreeTotalDepth() {
		return $ag.getTreeTotalDepth.call($ag, this.pid);
	}
	hideColumnByDataField(dataField) {
		$ag.hideColumnByDataField.call($ag, this.pid, arguments[0]);
	}
	hideColumnGroup(dataField) {
		$ag.hideColumnGroup.call($ag, this.pid, arguments[0]);
	}
	hideFooterLater() {
		$ag.hideFooterLater.call($ag, this.pid);
	}
	indentTreeDepth() {
		$ag.indentTreeDepth.call($ag, this.pid);
	}
	indexToRowId(rowIndex) {
		return $ag.indexToRowId.call($ag, this.pid, arguments[0]);
	}
	isAddedById(rowId) {
		return $ag.isAddedById.call($ag, this.pid, arguments[0]);
	}
	isAddedByRowIndex(rowIndex) {
		return $ag.isAddedByRowIndex.call($ag, this.pid, arguments[0]);
	}
	isAvailabePdf() {
		return $ag.isAvailabePdf.call($ag, this.pid);
	}
	isAvailableLocalDownload() {
		return $ag.isAvailableLocalDownload.call($ag, this.pid);
	}
	isCheckedRowById(rowId) {
		return $ag.isCheckedRowById.call($ag, this.pid, arguments[0]);
	}
	isCreated() {
		return $ag.isCreated.call($ag, this.pid);
	}
	isEditedById(rowId) {
		return $ag.isEditedById.call($ag, this.pid, arguments[0]);
	}
	isEditedByRowIndex(rowIndex) {
		return $ag.isEditedByRowIndex.call($ag, this.pid, arguments[0]);
	}
	isEditedCell(rowId, dataField) {
		return $ag.isEditedCell.call($ag, this.pid, arguments[0], arguments[1]);
	}
	isEditedCellByIndex(rowIndex, columnIndex) {
		return $ag.isEditedCellByIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	isFilteredGrid() {
		return $ag.isFilteredGrid.call($ag, this.pid);
	}
	isItemBranchByRowId(rowId) {
		return $ag.isItemBranchByRowId.call($ag, this.pid, arguments[0]);
	}
	isItemOpenByRowId(rowId) {
		return $ag.isItemOpenByRowId.call($ag, this.pid, arguments[0]);
	}
	isItemVisibleByRowId(rowId) {
		return $ag.isItemVisibleByRowId.call($ag, this.pid, arguments[0]);
	}
	isMergedCell(rowIndex, columnIndex) {
		return $ag.isMergedCell.call($ag, this.pid, arguments[0], arguments[1]);
	}
	isOpenFilterLayer() {
		return $ag.isOpenFilterLayer.call($ag, this.pid);
	}
	isRemovedById(rowId) {
		return $ag.isRemovedById.call($ag, this.pid, arguments[0]);
	}
	isRemovedByRowIndex(rowIndex) {
		return $ag.isRemovedByRowIndex.call($ag, this.pid, arguments[0]);
	}
	isSortedGrid() {
		return $ag.isSortedGrid.call($ag, this.pid);
	}
	isTreeGrid() {
		return $ag.isTreeGrid.call($ag, this.pid);
	}
	isUniqueValue(dataField, value) {
		return $ag.isUniqueValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	movePageTo(pageNum, keepVScrollPos, keepHScrollPos) {
		$ag.movePageTo.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	moveRows2Down() {
		$ag.moveRows2Down.call($ag, this.pid);
	}
	moveRows2Up() {
		$ag.moveRows2Up.call($ag, this.pid);
	}
	moveRowsToDown() {
		$ag.moveRowsToDown.call($ag, this.pid);
	}
	moveRowsToUp() {
		$ag.moveRowsToUp.call($ag, this.pid);
	}
	openEditDownListLayer() {
		$ag.openEditDownListLayer.call($ag, this.pid);
	}
	openFilterLayer(dataField) {
		$ag.openFilterLayer.call($ag, this.pid, arguments[0]);
	}
	openInputer() {
		$ag.openInputer.call($ag, this.pid);
	}
	outdentTreeDepth() {
		$ag.outdentTreeDepth.call($ag, this.pid);
	}
	redo() {
		$ag.redo.call($ag, this.pid);
	}
	redoable() {
		return $ag.redoable.call($ag, this.pid);
	}
	refresh() {
		$ag.refresh.call($ag, this.pid);
	}
	refreshRows(items, style, flashTime) {
		$ag.refreshRows.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	removeAjaxLoader() {
		$ag.removeAjaxLoader.call($ag, this.pid);
	}
	removeCheckedRows() {
		$ag.removeCheckedRows.call($ag, this.pid);
	}
	removeColumn(columnIndex) {
		$ag.removeColumn.call($ag, this.pid, arguments[0]);
	}
	removeInfoMessage() {
		$ag.removeInfoMessage.call($ag, this.pid);
	}
	removeRow(rowIndex) {
		$ag.removeRow.call($ag, this.pid, arguments[0]);
	}
	removeRowByRowId(rowIds) {
		$ag.removeRowByRowId.call($ag, this.pid, arguments[0]);
	}
	removeSoftRows(ids) {
		return $ag.removeSoftRows.call($ag, this.pid, arguments[0]);
	}
	removeToastMessage() {
		$ag.removeToastMessage.call($ag, this.pid);
	}
	resetUpdatedColumns(option) {
		$ag.resetUpdatedColumns.call($ag, this.pid, arguments[0]);
	}
	resetUpdatedItemById(rowId, option) {
		$ag.resetUpdatedItemById.call($ag, this.pid, arguments[0], arguments[1]);
	}
	resetUpdatedItems(option) {
		$ag.resetUpdatedItems.call($ag, this.pid, arguments[0]);
	}
	resize(width, height) {
		$ag.resize.call($ag, this.pid, arguments[0], arguments[1]);
	}
	restoreEditedCells(cells) {
		$ag.restoreEditedCells.call($ag, this.pid, arguments[0]);
	}
	restoreEditedRows(rowIndex) {
		$ag.restoreEditedRows.call($ag, this.pid, arguments[0]);
	}
	restoreSoftRows(option) {
		$ag.restoreSoftRows.call($ag, this.pid, arguments[0]);
	}
	rowIdToIndex(rowId) {
		return $ag.rowIdToIndex.call($ag, this.pid, arguments[0]);
	}
	search(dataField, term, opts) {
		$ag.search.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	searchAll(term, opts) {
		$ag.searchAll.call($ag, this.pid, arguments[0], arguments[1]);
	}
	selectRowsByRowId(rowId) {
		$ag.selectRowsByRowId.call($ag, this.pid, arguments[0]);
	}
	setAllCheckedRows(check) {
		$ag.setAllCheckedRows.call($ag, this.pid, arguments[0]);
	}
	setCellMerge(flag) {
		$ag.setCellMerge.call($ag, this.pid, arguments[0]);
	}
	setCellValue(rowIndex, dataField, value) {
		$ag.setCellValue.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	setCheckedRowsByIds(rowIds) {
		$ag.setCheckedRowsByIds.call($ag, this.pid, arguments[0]);
	}
	setCheckedRowsByValue(dataField, value) {
		$ag.setCheckedRowsByValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setColumnChildOrder(dataFieldOrders) {
		$ag.setColumnChildOrder.call($ag, this.pid, arguments[0]);
	}
	setColumnOrder(dataFieldOrders) {
		$ag.setColumnOrder.call($ag, this.pid, arguments[0]);
	}
	setColumnProp(columnIndex, propObj) {
		$ag.setColumnProp.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setColumnPropByDataField(dataField, propObj) {
		$ag.setColumnPropByDataField.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setColumnSizeList(sizeList) {
		return $ag.setColumnSizeList.call($ag, this.pid, arguments[0]);
	}
	setCsvGridData(csvData, isSimpleMode) {
		$ag.setCsvGridData.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setEditingInputValue(value) {
		$ag.setEditingInputValue.call($ag, this.pid, arguments[0]);
	}
	setFilter(dataField, func) {
		$ag.setFilter.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setFilterByValues(dataField, values) {
		$ag.setFilterByValues.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setFilterCache(cache) {
		$ag.setFilterCache.call($ag, this.pid, arguments[0]);
	}
	setFilterInlineTexts(values) {
		$ag.setFilterInlineTexts.call($ag, this.pid, arguments[0]);
	}
	setFixedColumnCount(count) {
		$ag.setFixedColumnCount.call($ag, this.pid, arguments[0]);
	}
	setFixedRowCount(count) {
		$ag.setFixedRowCount.call($ag, this.pid, arguments[0]);
	}
	setFocus() {
		$ag.setFocus.call($ag, this.pid);
	}
	setFooter(footerLayout) {
		$ag.setFooter.call($ag, this.pid, arguments[0]);
	}
	setGridData(data) {
		$ag.setGridData.call($ag, this.pid, arguments[0]);
	}
	setGroupBy(groupingFields, summaryProps) {
		$ag.setGroupBy.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setHScrollPosition(columnIndex) {
		$ag.setHScrollPosition.call($ag, this.pid, arguments[0]);
	}
	setHScrollPositionByPx(pixel) {
		$ag.setHScrollPositionByPx.call($ag, this.pid, arguments[0]);
	}
	setHeaderRendererProp(columnIndex, propObj) {
		$ag.setHeaderRendererProp.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setInfoMessage(msgHTML) {
		$ag.setInfoMessage.call($ag, this.pid, arguments[0]);
	}
	setPageRowCount(count) {
		$ag.setPageRowCount.call($ag, this.pid, arguments[0]);
	}
	setProp(obj, value) {
		$ag.setProp.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setProperty(obj, value) {
		$ag.setProperty.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setRendererProp(columnIndex, propObj) {
		$ag.setRendererProp.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setRowPosition(rowPosition) {
		$ag.setRowPosition.call($ag, this.pid, arguments[0]);
	}
	setScaleFactor(scaleFactor) {
		$ag.setScaleFactor.call($ag, this.pid, arguments[0]);
	}
	setSelectionAll() {
		$ag.setSelectionAll.call($ag, this.pid);
	}
	setSelectionBlock(startRowIndex, endRowIndex, startColumnIndex, endColumnIndex) {
		$ag.setSelectionBlock.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
	}
	setSelectionByIndex(rowIndex, columnIndex) {
		$ag.setSelectionByIndex.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setSelectionMode(mode) {
		$ag.setSelectionMode.call($ag, this.pid, arguments[0]);
	}
	setSorting(sortingInfoArr, onlyLastDepthSorting) {
		$ag.setSorting.call($ag, this.pid, arguments[0], arguments[1]);
	}
	setXmlGridData(xmlData, tagName) {
		$ag.setXmlGridData.call($ag, this.pid, arguments[0], arguments[1]);
	}
	showAjaxLoader() {
		$ag.showAjaxLoader.call($ag, this.pid);
	}
	showAllColumns() {
		$ag.showAllColumns.call($ag, this.pid);
	}
	showColumnByDataField(dataField) {
		$ag.showColumnByDataField.call($ag, this.pid, arguments[0]);
	}
	showColumnGroup(dataField) {
		$ag.showColumnGroup.call($ag, this.pid, arguments[0]);
	}
	showFooterLater() {
		$ag.showFooterLater.call($ag, this.pid);
	}
	showInfoMessage(msgHTML) {
		$ag.showInfoMessage.call($ag, this.pid, arguments[0]);
	}
	showItemsOnDepth(depth) {
		$ag.showItemsOnDepth.call($ag, this.pid, arguments[0]);
	}
	showToastMessage(rowIndex, columnIndex, message) {
		$ag.showToastMessage.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	syncGridData(gridData, stateCache) {
		$ag.syncGridData.call($ag, this.pid, arguments[0], arguments[1]);
	}
	unbind(name) {
		$ag.unbind.call($ag, this.pid, arguments[0]);
	}
	undo() {
		$ag.undo.call($ag, this.pid);
	}
	undoable() {
		return $ag.undoable.call($ag, this.pid);
	}
	update() {
		$ag.update.call($ag, this.pid);
	}
	updateAllToValue(dataField, value) {
		$ag.updateAllToValue.call($ag, this.pid, arguments[0], arguments[1]);
	}
	updateGrouping() {
		$ag.updateGrouping.call($ag, this.pid);
	}
	updateRow(item, rowIndex, isMarkEdited) {
		$ag.updateRow.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	updateRowBlockToValue(startRowIndex, endRowIndex, dataFields, values) {
		$ag.updateRowBlockToValue.call($ag, this.pid, arguments[0], arguments[1], arguments[2], arguments[3]);
	}
	updateRows(items, rowIndexes, isMarkEdited) {
		$ag.updateRows.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
	updateRowsById(items, isMarkEdited) {
		$ag.updateRowsById.call($ag, this.pid, arguments[0], arguments[1]);
	}
	validateChangedGridData(requireFields, message) {
		return $ag.validateChangedGridData.call($ag, this.pid, arguments[0], arguments[1]);
	}
	validateGridData(requireFields, message) {
		return $ag.validateGridData.call($ag, this.pid, arguments[0], arguments[1]);
	}
	validateGridDataByFunc(requireFields, validFunc, message) {
		return $ag.validateGridDataByFunc.call($ag, this.pid, arguments[0], arguments[1], arguments[2]);
	}
}

AUIGrid.propTypes = {
	name: PropTypes.string,
	autoResize: PropTypes.bool,
	resizeDelayTime: PropTypes.number,
	gridProps: PropTypes.object,
	columnLayout: PropTypes.array,
	footerLayout: PropTypes.array
};

AUIGrid.defaultProps = {
	name: '',
	autoResize: true,
	resizeDelayTime: 300,
	gridProps: {},
	columnLayout: [],
	footerLayout: []
};

export default AUIGrid;

export const agUtils = {
	isCreated: $ag.isCreated,
	formatDate: $ag.formatDate,
	formatNumber: $ag.formatNumber,
	getActiveGrid: $ag.getActiveGrid,
	getCreatedGridAll: $ag.getCreatedGridAll,
	makeValueMasked: $ag.makeValueMasked,
	makeValueUnmasked: $ag.makeValueUnmasked,
	releaseDate: $ag.releaseDate,
	version: $ag.version
};
