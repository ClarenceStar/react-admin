import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Operation from './operation';
import List from './list';

class Transfer extends React.PureComponent {
    constructor(props) {
        super(props);
        const {selectedKeys=[], targetKeys} = props
        this.state = {
            sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
            targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
        }

    }

    componentWillReceiveProps(nextProps) {
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;
        const { orderBy } = this.props;

        if (nextProps.targetKeys !== this.props.targetKeys ||
        nextProps.dataSource !== this.props.dataSource) {
            // clear cached splited dataSource
            this.splitedDataSource = null;


            if (nextProps.selectedKeys.length === 0) {
                // clear key nolonger existed
                // clear checkedKeys according to targetKeys
                const { dataSource, targetKeys = [] } = nextProps;

                const newSourceSelectedKeys = [];
                const newTargetSelectedKeys = [];
                dataSource.forEach(({ key }) => {
                    if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
                        newSourceSelectedKeys.push(key);
                    }
                    if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
                        newTargetSelectedKeys.push(key);
                    }
                });

                this.setState({
                    sourceSelectedKeys: newSourceSelectedKeys,
                    targetSelectedKeys: newTargetSelectedKeys,
                });
            }
        }

        if (nextProps.selectedKeys.length > 0) {
            const targetKeys = nextProps.targetKeys;
            const newTargetKeys = !!orderBy ? orderBy(targetKeys) : targetKeys;
            this.setState({
                sourceSelectedKeys: nextProps.selectedKeys.filter(key => !targetKeys.includes(key)),
                targetSelectedKeys: nextProps.selectedKeys.filter(key => targetKeys.includes(key)),
            });
        }
    }

    render() {
        const { operations, listStyle, headerStyle, titles, onChange, onDropValidate, renderFooter, targetKeys, onItemClick, prefixCls, clickMode, drag } = this.props;
        const { leftDataSource, rightDataSource } = this._splitDataSource();
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;

        const leftActive = targetSelectedKeys.length > 0;
        const rightActive = sourceSelectedKeys.length > 0;
        return (
            <div className="transfer">
               <List
                    dataSource={leftDataSource}
                    checkedKeys={sourceSelectedKeys}
                    handleSelect={this._handleLeftSelect}
                    handleClick={this._handleLeftClick}
                    style={listStyle}
                    headerStyle={headerStyle}
                    titleText={titles[0]}
                    onChange={onChange}
                    onDropValidate={onDropValidate}
                    renderFooter={renderFooter}
                    handleDrag={this._handleDrag}
                    type="left"
                    drag={drag}
                    clickMode={clickMode}
                    onItemClick={onItemClick}
                    itemIcon={'plus'}
                />
                <Operation
                    leftActive={leftActive}
                    rightActive={rightActive}
                    moveToRight={this._moveToRight}
                    moveToLeft={this._moveToLeft}
                    rightArrowText={operations[0]}
                    leftArrowText={operations[1]}
                    drag={drag}
                    prefixCls={prefixCls}
                    clickMode={clickMode}
                />
               <List
                    dataSource={rightDataSource}
                    checkedKeys={targetSelectedKeys}
                    handleSelect={this._handleRightSelect}
                    handleClick={this._handleRightClick}
                    style={listStyle}
                    headerStyle={headerStyle}
                    titleText={titles[1]}
                    onChange={onChange}
                    onDropValidate={onDropValidate}
                    renderFooter={renderFooter}
                    handleDrag={this._handleDrag}
                    type="right"
                    clickMode={clickMode}
                    drag={drag}
                    onItemClick={onItemClick}
                    itemIcon={'trash'}
               />
            </div>
        )
    }

    // 根据targetKeys, 把dataSource数据分配至左右框中
    _splitDataSource() {
        const {dataSource, targetKeys} = this.props;

        if (this.splitedDataSource) {
            return this.splitedDataSource;
        }

        const leftDataSource = [];
        const rightDataSource = new Array(targetKeys.length);

        dataSource.forEach(record => {

            // rightDataSource should be ordered by targetKeys
            // leftDataSource should be ordered by dataSource
            const indexOfKey = targetKeys.indexOf(record.key);
            if (indexOfKey !== -1) {
                rightDataSource[indexOfKey] = record;
            } else {
                leftDataSource.push(record);
            }
        });

        this.splitedDataSource = {
            leftDataSource,
            rightDataSource,
        };

        return this.splitedDataSource;
    }

    _handleLeftSelect = (item) => {
        const { selectedKeys } = this.props;
        const sourceSelectedKeys = this.state.sourceSelectedKeys;
        let holder = [...sourceSelectedKeys];

        // 选中的项放入sourceSelectedKeys 或者 从中删除
        const index = holder.indexOf(item.key);

        if (index > -1) {
            holder.splice(index, 1);
        } else {
            holder.push(item.key);
        }

        if ( selectedKeys.length === 0 ){
            this.setState({
                sourceSelectedKeys: holder,
            })
        }
    }

    _handleRightSelect = (item) => {
        const { selectedKeys } = this.props;
        const targetSelectedKeys = this.state.targetSelectedKeys;
        let holder = [...targetSelectedKeys];

        // 选中的项放入targetSelectedKeys 或者 从中删除
        const index = holder.indexOf(item.key);

        if (index > -1) {
            holder.splice(index, 1);
        } else {
            holder.push(item.key);
        }

        if ( selectedKeys.length === 0 ){
            this.setState({
                targetSelectedKeys: holder
            })
        }
    }

    _handleLeftClick = (item) => {
        this._moveToRight([item.key]);
    }

    _handleRightClick = (item) => {
        this._moveToLeft([item.key]);
    }

    _moveToRight = (_selectedKeys) => {
        const { dataSource, targetKeys, onChange } = this.props;
        const { sourceSelectedKeys } = this.state;
        const selectedKeys = _selectedKeys ? _selectedKeys : sourceSelectedKeys;

        // filter the disabled options
        let newTargetKeys = selectedKeys.filter(key => !dataSource.some(data => !!(key === data.key && data.disabled)));

        // 更新targetKeys, 加入新的选中项
        newTargetKeys = targetKeys.concat(newTargetKeys);

        // empty checked keys
        this.setState({
            sourceSelectedKeys: [],
        });

        if (onChange) {
            onChange(newTargetKeys, selectedKeys);
        }
    }

    _moveToLeft = (_selectedKeys) => {
        const { dataSource, targetKeys, onChange } = this.props;
        const { targetSelectedKeys } = this.state;
        const selectedKeys = _selectedKeys ? _selectedKeys : targetSelectedKeys;

        // filter the disabled options
        let newTargetSelectedKeys = selectedKeys.filter(key => !dataSource.some(data => !!(key === data.key && data.disabled)));

        // 更新targetKeys, 从targetKeys 中移除选中项
        const newTargetKeys = targetKeys.filter((key)=> newTargetSelectedKeys.indexOf(key)===-1);

        // empty checked keys
        this.setState({
            targetSelectedKeys: [],
        });

        if (onChange) {
            onChange(newTargetKeys, selectedKeys);
        }
    }

    _handleDrag = (dropProps) => {
        const { sourceType, targetType } = dropProps;

        if (sourceType === 'left' && targetType === 'right'){

            this._dragLeftToRight(dropProps);

        }else if (sourceType === 'right' && targetType === 'left') {

            this._dragRightToLeft(dropProps);

        }else if (sourceType === 'right' && targetType === 'right') {

            this._dragRightToRight(dropProps)

        } else {

            this._dragLeftToLeft(dropProps);
        }
    }

    _dragLeftToRight = (dropProps) => {
        const { targetKeys, onChange, onItemDrop } = this.props;
        const { sourceIndex, targetIndex, sourceKey } = dropProps;

        const newTargetKeys = [...targetKeys];
        newTargetKeys.splice(targetIndex-1, 0, sourceKey);

        const callOnchange = onItemDrop && onItemDrop(dropProps);
        if ( callOnchange ) {
            onChange && onChange(newTargetKeys, [sourceKey]);
        }
    }

    _dragRightToLeft = (dropProps) => {
        const { targetKeys, onChange, onItemDrop } = this.props;
        const { sourceIndex, targetIndex, sourceKey } = dropProps;

        const newTargetKeys = [...targetKeys];
        newTargetKeys.splice(sourceIndex-1, 1);

        const callOnchange = onItemDrop && onItemDrop(dropProps);
        if ( callOnchange ) {
            onChange && onChange(newTargetKeys, [sourceKey]);
        }
    }

    _dragRightToRight = (dropProps) => {
        const { targetKeys, onChange, onItemDrop } = this.props;
        const { sourceIndex, targetIndex, sourceKey } = dropProps;
        const newTargetKeys = [...targetKeys];

        // 从上往下拖
        if ( (sourceIndex - targetIndex) <= -2) {
            newTargetKeys.splice(targetIndex-1, 0, sourceKey);
            newTargetKeys.splice(sourceIndex-1, 1);
        }
        // 从下往上拖
        else if ( (sourceIndex - targetIndex) >= 1 ) {
            newTargetKeys.splice(sourceIndex-1, 1);
            newTargetKeys.splice(targetIndex-1, 0, sourceKey);
        }

        const callOnchange = onItemDrop && onItemDrop(dropProps);
        if ( callOnchange ) {
            onChange && onChange(newTargetKeys, [sourceKey]);
        }
    }

    //
    _dragLeftToLeft = (dropProps) => {

    }
}

Transfer.defaultProps = {
    dataSource: [],
    targetKeys: [],
    selectedKeys: [],
    operations: ["", ""],
    titles: ["", ""],
    clickMode: true,
    drag: false,
    prefixCls: "transfer",
    onItemClick: () => {}
}

Transfer.propTypes = {
    /**
     * [dataSource description]
     * @type {[array]}
     * 穿梭框数据
     *      @param {String} key
     *      @param {String} title
     *      @param {String} description
     *      @param {bool} disabled
     */
    dataSource: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        disabled: PropTypes.bool
    })),
    /**
     * [targetKeys description]
     * @type {[array]}
     * 显示在右侧框数据的key集合
     */
    targetKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * [selectedKeys description]
     * @type {[array]}
     * 设置哪些项应该被选中
     */
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * [onItemClick description]
     * @type {[function]}
     * 点击选项回调函数
     */
    onItemClick: PropTypes.func,
    /**
     * [onItemClick description]
     * @type {[function]}
     * 拖放结束后回调函数
     */
    onItemDrop: PropTypes.func,
    /**
     * [onChange description]
     * @type {[function]}
     * 选项在两栏之间转移时的回调函数
     */
    onChange: PropTypes.func,
    /**
     * [operations description]
     * @type {[array]}
     * 操作文案集合，顺序从下至上
     */
    operations: PropTypes.arrayOf(PropTypes.string),
    /**
     * [listStyle description]
     * @type {[object]}
     * 两个穿梭框的自定义样式
     */
    listStyle: PropTypes.object,
    /**
     * [titles description]
     * @type {[array]}
     * 标题集合，顺序从左至右
     */
    titles: PropTypes.arrayOf(PropTypes.string),
    /**
     * [onDropValidate description]
     * @type {[function]}
     *      @param {String} sourceOrder
     *      @param {String} targetOrder
     *      @param {String} sourceType
     *      @param {String} targetType
     * 拖拽触发的回调函数
     */
    onDropValidate: PropTypes.func,
    /**
     * [onChange description]
     * @type {[function]}
     * 底部渲染函数
     */
    renderFooter: PropTypes.func,
    /**
     * [clickMode：false —— checkbox可选模式]
     * [clickMode：true —— 点击穿梭模式]
     * @type {[bool]}
     */
    clickMode: PropTypes.bool,
    /**
     * [drag 启用或者禁用拖拽]
     * @type {[bool]}
     */
    drag: PropTypes.bool,
    /**
     * [headerStyle 头部样式]
     * @type {[object]}
     */
    headerStyle: PropTypes.object,
    /**
     * [orderBy 排序]
     * @type {[function]}
     */
    orderBy: PropTypes.func
};

export default Transfer;
