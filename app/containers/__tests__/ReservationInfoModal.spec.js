import { expect } from 'chai';
import { shallow } from 'enzyme';
import queryString from 'query-string';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationInfoModal as ReservationInfoModal,
} from 'containers/ReservationInfoModal';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import { makeButtonTests } from 'utils/TestUtils';

describe('Container: ReservationInfoModal', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    businessId: '1234567',
    comments: 'Just some comments.',
    company: 'Rebellion',
    eventDescription: 'Jedi mind tricks',
    numberOfParticipants: 12,
    reserverAddressCity: 'Mos Eisley',
    reserverAddressStreet: 'Cantina street 3B',
    reserverAddressZip: '12345',
    reserverEmailAddress: 'luke@sky.com',
    reserverName: 'Luke Skywalker',
    reserverPhoneNumber: '1234567',
  });
  const defaultProps = {
    actions: {
      closeReservationInfoModal: simple.stub(),
      putReservation: simple.stub(),
      selectReservationToEdit: simple.stub(),
      updatePath: simple.stub(),
    },
    isEditingReservations: false,
    reservationsToShow: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    show: true,
    staffUnits: [],
  };

  function getWrapper(extraProps = {}) {
    return shallow(<ReservationInfoModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('should render a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);

      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      const modalHeader = getWrapper().find(Modal.Header);

      it('should render a ModalHeader component', () => {
        expect(modalHeader.length).to.equal(1);
      });

      it('should contain a close button', () => {
        expect(modalHeader.props().closeButton).to.equal(true);
      });

      it('should render a ModalTitle component', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.length).to.equal(1);
      });

      it('the ModalTitle should display text "Varauksen tiedot"', () => {
        const modalTitle = getWrapper().find(Modal.Title);

        expect(modalTitle.props().children).to.equal('Varauksen tiedot');
      });
    });

    describe('Modal body', () => {
      const modalBody = getWrapper().find(Modal.Body);

      it('should render a ModalBody component', () => {
        expect(modalBody.length).to.equal(1);
      });

      describe('reservation data', () => {
        const dl = getWrapper().find('dl');
        const dlText = dl.text();

        it('should render a definition list', () => {
          expect(dl.length).to.equal(1);
        });

        it('should render reservation.billingAddressCity', () => {
          expect(dlText).to.contain(reservation.billingAddressCity);
        });

        it('should render reservation.billingAddressStreet', () => {
          expect(dlText).to.contain(reservation.billingAddressStreet);
        });

        it('should render reservation.billingAddressZip', () => {
          expect(dlText).to.contain(reservation.billingAddressZip);
        });

        it('should render reservation.businessId', () => {
          expect(dlText).to.contain(reservation.businessId);
        });

        it('should render reservation.company', () => {
          expect(dlText).to.contain(reservation.company);
        });

        it('should render reservation.eventDescription', () => {
          expect(dlText).to.contain(reservation.eventDescription);
        });

        it('should render reservation.numberOfParticipants', () => {
          expect(dlText).to.contain(reservation.numberOfParticipants);
        });

        it('should render reservation.reserverAddressCity', () => {
          expect(dlText).to.contain(reservation.reserverAddressCity);
        });

        it('should render reservation.reserverAddressStreet', () => {
          expect(dlText).to.contain(reservation.reserverAddressStreet);
        });

        it('should render reservation.reserverAddressZip', () => {
          expect(dlText).to.contain(reservation.reserverAddressZip);
        });

        it('should render reservation.reserverEmailAddress', () => {
          expect(dlText).to.contain(reservation.reserverEmailAddress);
        });

        it('should render reservation.reserverName', () => {
          expect(dlText).to.contain(reservation.reserverName);
        });

        it('should render reservation.reserverPhoneNumber', () => {
          expect(dlText).to.contain(reservation.reserverPhoneNumber);
        });

        it('should not render reservation.comments', () => {
          expect(dlText).to.not.contain(reservation.comments);
        });
      });

      describe('comments input', () => {
        describe('if user has admin rights', () => {
          const wrapper = getWrapper({
            resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: true } }) },
          });
          const input = wrapper.find(Input);

          it('should render textarea input for comments', () => {
            expect(input.length).to.equal(1);
            expect(input.props().type).to.equal('textarea');
          });

          it('should have reservation.comments as default value', () => {
            expect(input.props().defaultValue).to.equal(reservation.comments);
          });
        });

        describe('if user does not have admin rights', () => {
          const wrapper = getWrapper({
            resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: false } }) },
          });
          const input = wrapper.find(Input);

          it('should not render textarea input for comments', () => {
            expect(input.length).to.equal(0);
          });
        });
      });
    });

    describe('Footer buttons', () => {
      describe('if user has staff permissions', () => {
        const wrapper = getWrapper({
          resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: true } }) },
          staffUnits: [resource.unit],
        });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('should render three buttons', () => {
          expect(buttons.length).to.equal(3);
        });

        describe('the first button', () => {
          makeButtonTests(buttons.at(0), 'back', 'Takaisin', defaultProps.actions.closeReservationInfoModal);
        });

        describe('the second button', () => {
          const button = buttons.at(1);

          it('should be edit button', () => {
            expect(button.props().children).to.equal('Muokkaa');
          });

          it('should have handleEdit as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleEdit);
          });
        });

        describe('the third button', () => {
          const button = buttons.at(2);

          it('should be save button', () => {
            expect(button.props().children).to.equal('Tallenna');
          });

          it('should have handleSave as its onClick prop', () => {
            const instance = wrapper.instance();
            expect(button.props().onClick).to.equal(instance.handleSave);
          });
        });
      });

      describe('if user has regular admin permissions', () => {
        describe('if reservation state is not confirmed', () => {
          const wrapper = getWrapper({
            reservationsToShow: [Reservation.build({ resource: resource.id, state: 'requested' })],
            resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: true } }) },
            staffUnits: [],
          });
          const modalFooter = wrapper.find(Modal.Footer);
          const buttons = modalFooter.find(Button);

          it('should render three buttons', () => {
            expect(buttons.length).to.equal(3);
          });

          describe('the first button', () => {
            makeButtonTests(buttons.at(0), 'back', 'Takaisin', defaultProps.actions.closeReservationInfoModal);
          });

          describe('the second button', () => {
            const button = buttons.at(1);

            it('should be edit button', () => {
              expect(button.props().children).to.equal('Muokkaa');
            });

            it('should have handleEdit as its onClick prop', () => {
              const instance = wrapper.instance();
              expect(button.props().onClick).to.equal(instance.handleEdit);
            });
          });

          describe('the third button', () => {
            const button = buttons.at(2);

            it('should be save button', () => {
              expect(button.props().children).to.equal('Tallenna');
            });

            it('should have handleSave as its onClick prop', () => {
              const instance = wrapper.instance();
              expect(button.props().onClick).to.equal(instance.handleSave);
            });
          });
        });

        describe('if reservation state is confirmed', () => {
          const wrapper = getWrapper({
            reservationsToShow: [Reservation.build({ resource: resource.id, state: 'confirmed' })],
            resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: true } }) },
            staffUnits: [],
          });
          const modalFooter = wrapper.find(Modal.Footer);
          const buttons = modalFooter.find(Button);

          it('should render two buttons', () => {
            expect(buttons.length).to.equal(2);
          });

          describe('the first button', () => {
            makeButtonTests(buttons.at(0), 'back', 'Takaisin', defaultProps.actions.closeReservationInfoModal);
          });

          describe('the second button', () => {
            const button = buttons.at(1);

            it('should be save button', () => {
              expect(button.props().children).to.equal('Tallenna');
            });

            it('should have handleSave as its onClick prop', () => {
              const instance = wrapper.instance();
              expect(button.props().onClick).to.equal(instance.handleSave);
            });
          });
        });
      });

      describe('if user is a regular user', () => {
        const wrapper = getWrapper({
          resources: { [resource.id]: Resource.build({ userPermissions: { isAdmin: false } }) },
          staffUnits: [],
        });
        const modalFooter = wrapper.find(Modal.Footer);
        const buttons = modalFooter.find(Button);

        it('should render one button', () => {
          expect(buttons.length).to.equal(1);
        });

        describe('the button', () => {
          makeButtonTests(buttons.at(0), 'back', 'Takaisin', defaultProps.actions.closeReservationInfoModal);
        });
      });
    });
  });

  describe('handleEdit', () => {
    before(() => {
      const instance = getWrapper().instance();
      defaultProps.actions.closeReservationInfoModal.reset();
      defaultProps.actions.selectReservationToEdit.reset();
      defaultProps.actions.updatePath.reset();
      instance.handleEdit();
    });

    it('should call selectReservationToEdit with reservation and minPeriod', () => {
      expect(defaultProps.actions.selectReservationToEdit.callCount).to.equal(1);
      expect(
        defaultProps.actions.selectReservationToEdit.lastCall.args[0]
      ).to.deep.equal(
        { reservation: reservation, minPeriod: resource.minPeriod }
      );
    });

    it('should call the updatePath with correct url', () => {
      const actualUrlArg = defaultProps.actions.updatePath.lastCall.args[0];
      const query = queryString.stringify({
        date: reservation.begin.split('T')[0],
        time: reservation.begin,
      });
      const expectedUrl = `/resources/${reservation.resource}/reservation?${query}`;

      expect(defaultProps.actions.updatePath.callCount).to.equal(1);
      expect(actualUrlArg).to.equal(expectedUrl);
    });

    it('should close the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });

  describe('handleSave', () => {
    let updatedComments;

    before(() => {
      updatedComments = 'Updated comments';
      const instance = getWrapper().instance();
      instance.refs = {
        commentsInput: { getValue: () => updatedComments },
      };
      defaultProps.actions.closeReservationInfoModal.reset();
      defaultProps.actions.putReservation.reset();
      instance.handleSave();
    });

    it('should call putReservation for the first reservation in reservationsToShow', () => {
      expect(defaultProps.actions.putReservation.callCount).to.equal(1);
    });

    it('should call putReservation with correct arguments', () => {
      const actualArgs = defaultProps.actions.putReservation.lastCall.args;
      const expected = Object.assign({}, reservation, {
        comments: updatedComments,
        staffEvent: false,
      });

      expect(actualArgs[0]).to.deep.equal(expected);
    });

    it('should close the ReservationInfoModal', () => {
      expect(defaultProps.actions.closeReservationInfoModal.callCount).to.equal(1);
    });
  });
});
