import {
  DefaultDiv,
  GridHeader,
  GridHeaderItem,
  GridRefetch,
  type GridHeaderItemProps,
} from 'styles/style';

const PermissionAdminGridHeader = ({
  queryState,
  setQueryState,
  refetch,
  reload,
}: any) => {
  const handleQueryChange = (field: string, value: any) => {
    setQueryState({
      ...queryState,
      [field]: value,
    });
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      refetch();
    }
  };

  const gridHeaderData: GridHeaderItemProps[] = [
    {
      type: 'input',
      label: '메뉴권한이름',
      value: queryState.orgName,
      placeholder: '메뉴권한이름을 입력하세요',
      onChange(e: any) {
        handleQueryChange('name', e.target.value);
      },
      onKeyDown: handleKeyPress,
    },
  ];

  return (
    <DefaultDiv>
      <GridRefetch refetch={refetch} reload={reload} />
      <GridHeader container grid>
        {gridHeaderData.map((item, index) => {
          return (
            <GridHeaderItem
              key={index}
              type={item.type}
              label={item.label}
              value={item.value}
              onChange={item.onChange}
              onKeyDown={item?.onKeyDown}
              placeholder={item?.placeholder}
              listData={item?.listData}
            />
          );
        })}
      </GridHeader>
    </DefaultDiv>
  );
};

export default PermissionAdminGridHeader;
