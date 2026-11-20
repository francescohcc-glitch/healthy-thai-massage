export default function Booking() {
  return (
    <div className="booking-card">
      <div className="booking-card-image">
        <img src="/images/room.jpg" alt="Illustrative spa room with warm natural finishes" loading="lazy" width={900} height={1100} />
        <span>Illustrative spa setting</span>
      </div>
      <div className="booking-card-content">
        <span className="eyebrow">EASY ONLINE BOOKING</span>
        <h3>Your relaxation awaits.</h3>
        <p>Choose your massage and reserve your preferred time on our Setmore booking page.</p>
        <a className="button primary booking-cta" href="https://healthythaimassage4kve.setmore.com">Book Your Massage</a>
        <p className="booking-provider">Continue to Setmore to complete your reservation.</p>
      </div>
    </div>
  );
}
