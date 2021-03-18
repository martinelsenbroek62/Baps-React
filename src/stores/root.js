import { runInAction, makeAutoObservable } from "mobx";

export class RootStore {
  test = "GOODBYE";

  constructor() {
    // this.userStore = new UserStore(this)
    // this.todoStore = new TodoStore(this)
    this.productStore = new ProductStore(this);
    this.demandStore = new DemandStore(this);
  }
}

class ProductStore {
  test = "HELLO";
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }
}

class DemandStore {
  selectedSkus = [];
  demand = null;
  demandRevisions = [];
  selectedRevision = 0;
  demandAgg = "monthly"; // quarter | yearly \ monthly

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
      renderActualAndForecast: false,
    });
  }

  /**
   * Filter the demand for any `selectedSkus`, if empty return all demand
   *
   * @returns {null|Object}
   */
  get filteredDemand() {
    if (!this.demand) {
      console.debug("demand is empty, returning null filteredDemand");
      return null;
    }

    const filteredDemand = {};

    console.debug(`keys of demand ${Object.keys(this.demand)}`);

    Object.keys(this.demand).map((key) => {
      filteredDemand[key] = this.demand[key].filter((item) =>
        this.selectedSkus.length ? this.selectedSkus.includes(item.sku) : true
      );
    });

    console.debug(`computed filteredDemand`);
    console.debug(filteredDemand);

    return filteredDemand;
  }

  /**
   * @returns {null|Object}
   */
  get demandChartData() {
    if (!this.filteredDemand) {
      return null;
    }

    const demandChartData = {
      yearly: {},
      quarterly: {},
      monthly: {},
    };

    // monthly
    this.filteredDemand["monthly"].map((item, index) => {
      if (item.sku in demandChartData["monthly"]) {
        // console.debug(`here, ${item.sku} ${item.demand}`)
        demandChartData["monthly"][item.sku].push({
          key: index,
          y: item.demand,
          x: `${item.year}-${item.month}`,
          isActual: item.is_actual,
        });
      } else {
        // console.debug(`there, ${item.sku} ${item.demand}`)
        demandChartData["monthly"][item.sku] = [
          {
            key: index,
            y: item.demand,
            x: `${item.year}-${item.month}`,
            isActual: item.is_actual,
          },
        ];
      }
    });

    // quarterly
    this.filteredDemand["quarterly"].map((item, index) => {
      if (item.sku in demandChartData["quarterly"]) {
        demandChartData["quarterly"][item.sku].push({
          key: index,
          y: item.demand,
          x: `${item.quarter}`,
          isActual: item.is_actual,
        });
      } else {
        demandChartData["quarterly"][item.sku] = [
          {
            key: index,
            y: item.demand,
            x: `${item.quarter}`,
            isActual: item.is_actual,
          },
        ];
      }
    });

    // yearly
    this.filteredDemand["yearly"].map((item, index) => {
      if (item.sku in demandChartData["yearly"]) {
        demandChartData["yearly"][item.sku].push({
          key: index,
          y: item.demand,
          x: `${item.year}`,
          isActual: item.is_actual,
        });
      } else {
        demandChartData["yearly"][item.sku] = [
          {
            key: index,
            y: item.demand,
            x: `${item.year}`,
            isActual: item.is_actual,
          },
        ];
      }
    });

    console.debug(`computed demandChartData`);
    console.debug(demandChartData);

    return demandChartData;
  }

  /**
   * @returns {null|Object}
   */
  get demandTableData() {
    if (!this.filteredDemand) {
      return null;
    }

    const demandTableData = {};

    // monthly
    demandTableData["monthly"] = this.filteredDemand["monthly"].map(
      (item, idx) => {
        return {
          key: idx,
          demand: item.demand,
          demandCenter: item.demand_center,
          month: item.month,
          year: item.year,
          quarter: item.quarter,
          sku: item.sku,
          isActual: item.is_actual,
        };
      }
    );

    // quarterly
    demandTableData["quarterly"] = this.filteredDemand["quarterly"].map(
      (item, idx) => {
        return {
          key: idx,
          demand: item.demand,
          demandCenter: item.demand_center,
          year: item.year,
          quarter: item.quarter,
          sku: item.sku,
          isActual: item.is_actual,
        };
      }
    );

    // yearly
    demandTableData["yearly"] = this.filteredDemand["yearly"].map(
      (item, idx) => {
        return {
          key: idx,
          demand: item.demand,
          demandCenter: item.demand_center,
          year: item.year,
          sku: item.sku,
          isActual: item.is_actual,
        };
      }
    );

    console.debug(`computed demandTableData`);
    console.debug(demandTableData);

    return demandTableData;
  }

  get demandTableColumnsMeta() {
    if (!this.demand) {
      return [
        {
          title: "SKU",
          dataIndex: "sku",
        },
        {
          title: "Demand Center",
          dataIndex: "demandCenter",
        },
        {
          title: "Month",
          dataIndex: "month",
        },
        {
          title: "Quarter",
          dataIndex: "quarter",
        },
        {
          title: "Year",
          dataIndex: "year",
        },
        {
          title: "Demand",
          dataIndex: "demand",
        },
      ];
    }

    const meta = [
      {
        title: "SKU",
        dataIndex: "sku",
        render: this.renderActualAndForecast,
        // filters: this.demand.map(item => item.sku).filter(uniqueArray).map(item => { return { text: item, value: item } }),
        // onFilter: (value, record) => record.sku.indexOf(value) === 0
      },
    ];

    if (this.demandAgg === "monthly") {
      meta.push(
        ...[
          {
            title: "Demand Center",
            dataIndex: "demandCenter",
            render: this.renderActualAndForecast,
            // filters: this.demand.map(item => item.demand_center.name).filter(uniqueArray).map(item => { return { text: item, value: item } }),
            // onFilter: (value, record) => record.demandCenter.indexOf(value) === 0
          },
          {
            title: "Month",
            dataIndex: "month",
            render: this.renderActualAndForecast,
          },
          {
            title: "Quarter",
            dataIndex: "quarter",
            render: this.renderActualAndForecast,
          },
        ]
      );
    } else if (this.demandAgg === "quarterly") {
      meta.push({
        title: "Quarter",
        dataIndex: "quarter",
        render: this.renderActualAndForecast,
      });
    }

    meta.push(
      ...[
        {
          title: "Year",
          dataIndex: "year",
          render: this.renderActualAndForecast,
        },
        {
          title: "Demand",
          dataIndex: "demand",
          render: this.renderActualAndForecast,
        },
      ]
    );

    console.log("table meta", meta);

    return meta;
  }

  renderActualAndForecast(text, record, index) {
    const bg = record.isActual ? "green" : "";
    const fw = record.isActual ? "bold" : "";
    return <div style={{ color: bg, fontWeight: fw }}>{text}</div>;
  }

  setSelectedRevision(revision) {
    this.selectedRevision = revision;
    this.fetchDemand(false, revision);
  }

  /**
   *
   * @param {string} agg  - monthly | quarterly | yearly
   *
   * @throws error if agg not a valid string
   */
  setDemandAgg(agg) {
    if (!["monthly", "quarterly", "yearly"].includes(agg)) {
      throw new Error(`Invalid aggregation passed, ${agg}`);
    }
    this.demandAgg = agg;
  }

  /**
   *
   * @param {string|string[]} skus
   */
  setSelectedSkus(skus) {
    if (typeof skus === "string") {
      this.selectedSkus = [skus];
    } else {
      this.selectedSkus = skus;
    }

    console.log(this.selectedSkus);
  }

  async fetchDemand(all = false, revision = 0) {
    try {
      const result = await fetch(`/demand?all=${all}&revision=${revision}`);
      const json = await result.json();
      runInAction(() => {
        this.demand = json;
        // go ahead and set correct revision
        // from response if starting with 0 revision
        if (this.selectedRevision === 0) {
          this.selectedRevision = json["monthly"][0].revision_id;
        }
        console.log("fetchDemand", json);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fetchRevisions() {
    try {
      const result = await fetch(`/demand/revisions`);
      const json = await result.json();
      runInAction(() => {
        this.demandRevisions = json;
        console.log("fetchRevisions", json);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
