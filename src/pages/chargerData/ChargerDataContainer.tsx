export const ChargerDataContainer = () => {
  return (
    <div className="contents">
      <div className="cont-head">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#managing-charger-data-tab-01"
            >
              충전기 데이터 관리
            </a>
          </li>
        </ul>
      </div>

      <div className="tab-content">
        <div className="tab-pane show active" id="managing-charger-data-tab-01">
          <div className="bg-box w-100 mb-0">
            <div className="managing-charger-data-grid">
              <div className="label-form form-horizontal">
                <label>제조사</label>
                <div className="hd-select">
                  <select>
                    <option value="0">선택</option>
                  </select>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>모델</label>
                <div className="hd-select">
                  <select>
                    <option value="0">선택</option>
                  </select>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>속도</label>
                <div className="hd-select">
                  <select>
                    <option value="0">선택</option>
                  </select>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>펌웨어</label>
                <div className="hd-select">
                  <select>
                    <option value="0">선택</option>
                  </select>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>스팩</label>
                <input type="text" placeholder="입력" />
              </div>
              <div className="label-form form-horizontal">
                <label>충전기예약</label>
                <div className="btn-group select-tabs">
                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-cr"
                    id="tab-cr1"
                    autoComplete="off"
                    defaultChecked
                  />
                  <label className="btn" htmlFor="tab-cr1">
                    가능
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-cr"
                    id="tab-cr2"
                    autoComplete="off"
                  />
                  <label className="btn" htmlFor="tab-cr2">
                    불가능
                  </label>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>PnC</label>
                <div className="btn-group select-tabs">
                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-pnc"
                    id="tab-pnc1"
                    autoComplete="off"
                    defaultChecked
                  />
                  <label className="btn" htmlFor="tab-pnc1">
                    가능
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-pnc"
                    id="tab-pnc2"
                    autoComplete="off"
                  />
                  <label className="btn" htmlFor="tab-pnc2">
                    불가능
                  </label>
                </div>
              </div>
              <div className="label-form form-horizontal">
                <label>광고</label>
                <div className="btn-group select-tabs">
                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-add"
                    id="tab-add1"
                    autoComplete="off"
                    defaultChecked
                  />
                  <label className="btn" htmlFor="tab-add1">
                    가능
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tab-add"
                    id="tab-add2"
                    autoComplete="off"
                  />
                  <label className="btn" htmlFor="tab-add2">
                    불가능
                  </label>
                </div>
              </div>
              <div>{/* 공란 */}</div>
              <div className="label-form form-horizontal">
                <label>최근등록일</label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value="2023-02-02"
                  className="calendar"
                  readOnly
                />
              </div>
              <div className="label-form form-horizontal">
                <label>등록담당자</label>
                <input
                  type="text"
                  value="EV사업팀 김지은"
                  className="readonly"
                  readOnly
                />
              </div>
            </div>

            <div className="bottom-btn-group">
              <button type="button" className="btn btn-md btn-reset">
                취소
              </button>
              <button type="button" className="btn btn-md btn-primary">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
