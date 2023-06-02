import Layout from "../components/Layout/Layout";
import TicketsList from "../components/TicketList";


export default function TicketsPage() {
    return (
      <div className="TicketsPage">
        <Layout/>
        <TicketsList/>
      </div>
    );
  }