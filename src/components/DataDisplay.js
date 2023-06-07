import React from "react";
import { useSelector } from "react-redux";
import "./DataDisplay.css";
//import { getTransactions } from "../store/transaction";

const DataDisplay = () => {
  //const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);
  const currentStep = useSelector((state) => state.transaction.currentStep);

  //   useEffect(() => {
  //     dispatch(getTransactions());
  //   }, [dispatch]);

  //   useEffect(() => {
  //     if (!loading && transactions?.length > 0) {
  //       calculateAverageSpendingByCategory();
  //     }
  //   }, [loading, transactions]);

  //pravim objekat koji ce da ima naziv kategorije i u objektu njihove ukupne sume koje i broj transakcija od kog posle pravim srednju vrednost

  const calculateAverageSpendingByCategory = () => {
    const categoryMap = {};
    for (let i = 0; i < transactions?.length; i++) {
      const transaction = transactions[i];
      const category = transaction.subClass?.code;
      const categoryName = transaction.subClass?.title;
      const amount = parseFloat(transaction.amount);
      if (category && !isNaN(amount) && amount < 0) {
        if (!categoryMap[category]) {
          categoryMap[category] = {
            totalAmount: 0,
            count: 0,
            categoryName: categoryName || "",
          };
        }
        categoryMap[category].categoryName = categoryName;
        categoryMap[category].count++;
        categoryMap[category].totalAmount += amount;
      }
    }

    //racunam prosecnu potrosnju
    const averageSpendingByCategory = {};
    for (const category in categoryMap) {
      const totalAmount = categoryMap[category].totalAmount;
      const count = categoryMap[category].count;
      const average = count > 0 ? totalAmount / count : 0;
      averageSpendingByCategory[category] = {
        average: average.toFixed(2),
        categoryName: categoryMap[category].categoryName,
      };
    }
    return averageSpendingByCategory;
  };

  const averageSpendingByCategory = calculateAverageSpendingByCategory();

  return (
    <div className="data-display">
      <h2>Data Display</h2>

      <table>
        <thead>
          <tr>
            <th>Category code</th>
            <th>Category title</th>
            <th>Average Consumption</th>
          </tr>
        </thead>
        {/* <tbody>
          {Object.entries(averageSpendingByCategory).map(
            //object.entries pretvara objekat u niz parova kljuc vrednost
            ([category, { average, categoryName }]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{categoryName}</td>
                <td>{Math.abs(average)}</td>
              </tr>
            )
          )}
        </tbody> */}
        {transactions?.length > 0 ? (
          <tbody>
            {Object.entries(averageSpendingByCategory).map(
              ([category, { average, categoryName }]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{categoryName}</td>
                  <td>{Math.abs(average)}</td>
                </tr>
              )
            )}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={3}>{currentStep}</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default DataDisplay;
