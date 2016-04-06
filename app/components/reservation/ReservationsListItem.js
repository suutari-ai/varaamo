import isEmpty from 'lodash/lang/isEmpty';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Label from 'react-bootstrap/lib/Label';
import { Link } from 'react-router';

import TimeRange from 'components/common/TimeRange';
import ReservationControls from 'components/reservation/ReservationControls';
import { RESERVATION_STATE_LABELS } from 'constants/AppConstants';
import {
  getCaption,
  getMainImage,
  getName,
} from 'utils/DataUtils';

class ReservationsListItem extends Component {
  constructor(props) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleCancelClick() {
    const {
      openReservationCancelModal,
      reservation,
      selectReservationToCancel,
    } = this.props;

    selectReservationToCancel(reservation);
    openReservationCancelModal();
  }

  handleConfirmClick() {
    const {
      confirmPreliminaryReservation,
      isAdmin,
      reservation,
    } = this.props;

    if (isAdmin && reservation.state === 'requested') {
      confirmPreliminaryReservation(reservation);
    }
  }

  handleDeleteClick() {
    const {
      openReservationDeleteModal,
      reservation,
      selectReservationToDelete,
    } = this.props;

    selectReservationToDelete(reservation);
    openReservationDeleteModal();
  }

  handleEditClick() {
    const {
      updatePath,
      reservation,
      resource,
      selectReservationToEdit,
    } = this.props;
    const query = queryString.stringify({
      date: reservation.begin.split('T')[0],
      time: reservation.begin,
    });

    selectReservationToEdit({ reservation, minPeriod: resource.minPeriod });
    updatePath(`/resources/${reservation.resource}/reservation?${query}`);
  }

  renderImage(image) {
    if (image && image.url) {
      const src = `${image.url}?dim=100x120`;
      return <img alt={getCaption(image)} src={src} />;
    }
    return null;
  }

  renderStateLabel(reservation) {
    if (!reservation.needManualConfirmation) {
      return null;
    }

    const { labelBsStyle, labelText } = RESERVATION_STATE_LABELS[reservation.state];

    return (
      <div className="state">
        <Label bsStyle={labelBsStyle}>{labelText}</Label>
      </div>
    );
  }

  render() {
    const {
      isAdmin,
      reservation,
      resource,
      unit,
    } = this.props;

    const nameSeparator = isEmpty(resource) || isEmpty(unit) ? '' : ',';

    return (
      <li className="reservation">
        <div className="image">
          <Link to={`/resources/${resource.id}`}>
            {this.renderImage(getMainImage(resource.images))}
          </Link>
        </div>
        <div className="names">
          <Link to={`/resources/${resource.id}`}>
            <h4>
              {getName(resource)}{nameSeparator} <span className="unit-name">{getName(unit)}</span>
            </h4>
          </Link>
        </div>
        <div className="time">
          <Link
            to={`/resources/${resource.id}/reservation`}
            query={{
              date: reservation.begin.split('T')[0],
              time: reservation.begin,
            }}
          >
            <TimeRange
              begin={reservation.begin}
              end={reservation.end}
              className="hidden-xs"
            />
            <TimeRange
              begin={reservation.begin}
              dateFormat="dd, D.M."
              end={reservation.end}
              className="visible-xs-block"
            />
          </Link>
        </div>
        { isAdmin && (
          <Button
            bsSize="xsmall"
            bsStyle="default"
            className="info-button"
          >
            Tiedot
          </Button>
        )}
        <ReservationControls
          isAdmin={isAdmin}
          onCancelClick={this.handleCancelClick}
          onConfirmClick={this.handleConfirmClick}
          onDeleteClick={this.handleDeleteClick}
          onEditClick={this.handleEditClick}
          reservation={reservation}
        />
      {this.renderStateLabel(reservation)}
      </li>
    );
  }
}

ReservationsListItem.propTypes = {
  confirmPreliminaryReservation: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  openReservationCancelModal: PropTypes.func.isRequired,
  openReservationDeleteModal: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  selectReservationToCancel: PropTypes.func.isRequired,
  selectReservationToDelete: PropTypes.func.isRequired,
  selectReservationToEdit: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  updatePath: PropTypes.func.isRequired,
};

export default ReservationsListItem;
