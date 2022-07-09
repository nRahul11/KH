/** @format */

const RoomFeatures = ({ room }) => {
  return (
    <>
      <div className="room-feature">
        <i className="fa fa-cog fa-fw fa-users" aria-hidden="true"></i>
        <p>
          {room.guestCapacity} {room.guestCapacity > 1 ? 'Guests' : 'Guest'}
        </p>
      </div>

      <div className="room-feature">
        <i className="fa fa-cog fa-fw fa-bed" aria-hidden="true"></i>
        <p>
          {room.numOfBeds} {room.numOfBeds > 1 ? 'Beds' : 'Bed'}
        </p>
      </div>

      <div className="room-feature">
        <i
          className={
            room.breakfast
              ? 'fa fa-check text-success'
              : 'fa fa-times text-danger'
          }
          aria-hidden="true"
        ></i>
        <p>Breakfast</p>
      </div>

      <div className="room-feature">
        <i
          className={
            room.internet
              ? 'fa fa-check text-success'
              : 'fa fa-times text-danger'
          }
          aria-hidden="true"
        ></i>
        <p>Internet</p>
      </div>

      <div className="room-feature">
        <i
          className={
            room.AC ? 'fa fa-check text-success' : 'fa fa-times text-danger'
          }
          aria-hidden="true"
        ></i>
        <p>AC</p>
      </div>

      <div className="room-feature">
        <i
          className={
            room.petsAllowed
              ? 'fa fa-check text-success'
              : 'fa fa-times text-danger'
          }
          aria-hidden="true"
        ></i>
        <p>Pets</p>
      </div>
      <div className="room-feature">
        <i
          className={
            room.roomCleaning
              ? 'fa fa-check text-success'
              : 'fa fa-times text-danger'
          }
          aria-hidden="true"
        ></i>
        <p>Room service</p>
      </div>
    </>
  );
};

export default RoomFeatures;
